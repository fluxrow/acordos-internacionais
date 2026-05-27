## Objetivo

Impedir compartilhamento de conta Pro **sem** prejudicar o uso legítimo do mesmo usuário em vários equipamentos próprios (notebook do escritório + desktop de casa + celular).

Estratégia em duas camadas:
1. **Camada forte — Sessão única ativa por vez** (independente de localização). Bloqueia o uso simultâneo real, que é o sintoma do compartilhamento.
2. **Camada fraca — Detecção de anomalia geográfica** (apenas alerta/registro, nunca bloqueia automaticamente). Sinaliza casos suspeitos para revisão manual.

Admin (Dr. Marcos) isento de ambas. Usuários Free não afetados.

---

## Por que geolocalização pura não funciona como bloqueio

- **Mesmo usuário, IPs diferentes**: escritório (IP fixo), casa (CGNAT da operadora), 4G (IP rotativo da torre), café (Wi-Fi público), viagem.
- **GeoIP impreciso**: pode apontar "São Paulo" pra um IP que está em Guarulhos, ou trocar de estado dependendo do roteamento da operadora.
- **VPN / Cloudflare WARP / Proxy corporativo**: muito comum entre profissionais. Mascara a localização real.
- **Mobilidade real**: advogado viaja a trabalho, atende cliente em outra cidade — bloquear seria absurdo.

Conclusão: geo **nunca** pode ser critério de bloqueio. Serve para *score de risco* + revisão.

---

## Camada 1 — Sessão única (regra forte)

Igual ao plano anterior, mas refinada:

- Cada navegador gera um `device_id` (UUID em `localStorage`). Mesmo navegador = mesmo dispositivo, em qualquer rede.
- Pro pode ter **N dispositivos cadastrados**, mas só **1 ativo por vez**. Trocar de dispositivo é livre — basta deslogar de um e entrar no outro (ou usar o botão "Sair de outros dispositivos").
- Tabela `active_sessions` com `(user_id, device_id, user_agent, ip_inet, geo_city, geo_region, geo_country, created_at, last_seen_at)`.
- Função `claim_session(p_device_id, ...)`:
  - Limpa sessões expiradas (`last_seen_at < now() - interval '2 minutes'`).
  - Admin ou não-Pro → upsert e libera.
  - Senão, se já existe outra sessão ativa → retorna `{ok:false, reason:'taken', other_device_label}` (mostra "MacBook · Chrome · ativo agora").
  - Caso ok → upsert.
- Heartbeat a cada 60s; se o servidor responder `ok:false` (expulso) → signOut + toast.
- Botão "Sair de outros dispositivos" na `/conta` chamando `release_other_sessions`.
- Página `/conta` lista dispositivos conhecidos (últimos 30 dias) com data/cidade aproximada — usuário tem visibilidade e pode revogar individualmente.

Isso resolve o uso simultâneo. Compartilhar conta vira inviável porque os dois se desconectam mutuamente.

---

## Camada 2 — Anomalia geográfica (sinal, não bloqueio)

Objetivo: detectar padrão "duas pessoas usando ao mesmo tempo em cidades distantes" sem prejudicar mobilidade legítima.

### Captura
- A cada `claim_session` e `heartbeat_session`, servidor lê `getRequestHeader('cf-connecting-ip')` (ou `x-forwarded-for`) e resolve geo via **header `cf-ipcountry` + `cf-ipcity`** (Cloudflare já injeta gratuitamente em Workers — **zero custo**, sem dependência externa).
- Persiste em `active_sessions` (cidade/região/país) e em `session_events` (log append-only de cada claim+heartbeat com timestamp/IP/geo).

### Regras de alerta (não bloqueiam)
Calculadas em background, em uma view ou função `detect_geo_anomalies(p_user_id)`:

1. **Velocidade física impossível**: dois eventos do mesmo usuário em <2h com distância >800km entre cidades (haversine das coords do GeoIP). Ex.: SP às 14h e Recife às 15h. Score alto.
2. **Países diferentes em <24h** (ignorando VPN óbvia → checar se ASN é de datacenter, biblioteca `is-datacenter-ip` ou tabela manual de ranges conhecidos da Cloudflare/AWS/etc).
3. **>3 cidades distintas em 7 dias**: score moderado (pode ser viagem; só alerta acumulado).

### O que fazer com o alerta
- **NÃO desloga**, **NÃO bloqueia**.
- Grava em `account_risk_flags(user_id, kind, score, evidence_jsonb, created_at, resolved_at)`.
- Notifica o admin (você) por e-mail/badge no painel admin: "Conta X com sinal de compartilhamento — revisar".
- Opcionalmente: envia e-mail ao próprio usuário "Detectamos acesso em SP e Recife em 1h. Foi você? Se não, troque sua senha." (transparência > punição automática).
- Decisão de cancelar/banir continua manual.

### Anti-falso-positivo embutido
- Se IP estiver em range de datacenter conhecido (VPN/proxy) → não conta para "velocidade impossível" (provavelmente é VPN do próprio usuário).
- Se mesmo `device_id` muda de cidade → não é compartilhamento, é mobilidade. Só conta como anomalia quando **device_ids diferentes** aparecem em cidades distantes próximas no tempo.

---

## Mudanças

### Banco (migration única)
- Tabela `active_sessions` (campos acima) + GRANTs + RLS (select/delete próprios; service_role full).
- Tabela `session_events` (append-only, retenção 30 dias via job): `user_id, device_id, event_type, ip_inet, geo_city, geo_region, geo_country, geo_lat, geo_lon, ip_asn, occurred_at`. RLS: usuário lê os próprios; service_role full.
- Tabela `account_risk_flags`: `user_id, kind, score, evidence jsonb, created_at, resolved_at, resolved_by`. RLS: somente admin lê/edita; service_role full.
- Funções SECURITY DEFINER: `claim_session`, `heartbeat_session`, `release_session`, `release_other_sessions`, `detect_geo_anomalies(p_user_id)`.
- Função `cleanup_old_session_events()` chamada por pg_cron diária.

### Server functions (`src/lib/session-guard.functions.ts`)
- `claimSession`, `heartbeatSession`, `releaseSession`, `releaseOtherSessions`, `listMyDevices`.
- Cada uma lê headers (`cf-connecting-ip`, `cf-ipcountry`, `cf-ipcity`, `cf-iplongitude`, `cf-iplatitude`) via `getRequestHeader` e passa pro DB.

### Server function admin (`src/lib/admin-risk.functions.ts`)
- `listRiskFlags()` (admin only).
- `resolveRiskFlag({flagId, action})` (admin marca como falso positivo / verdadeiro / cancelar conta).

### Cliente
- `src/lib/device-id.ts`: helper UUID em `localStorage`.
- `src/hooks/use-session-guard.ts`: claim + heartbeat 60s + cleanup no logout/beforeunload.
- `/conta`: lista de dispositivos + botão "Sair de outros dispositivos".
- `/admin/risco` (rota nova sob `_authenticated/_admin`): lista flags, evidência (mapa simples com cidades + horários), botões de ação.

### Documentação
- `.lovable/prd.md` e `ROADMAP.md`: "Sessão única Pro + detecção de anomalia geográfica (não-bloqueante)".

---

## O que o usuário legítimo sente

- Logar no notebook do escritório: ✅ funciona.
- Sair, ir pra casa, logar no desktop: ✅ funciona (sessão do escritório expira em 2min ou ele clica "Sair de outros").
- Esquecer logado no escritório e tentar logar em casa: vê mensagem clara *"Sua conta está ativa em outro dispositivo (MacBook · Chrome · São Paulo · ativo há 2min). [Sair de lá e entrar aqui]"* → 1 clique resolve.
- Viajar pra outra cidade: ✅ nenhum impacto (não bloqueia por geo).
- Usar VPN corporativa: ✅ nenhum impacto.

## O que um compartilhador sente

- Pessoa A em SP logada, pessoa B no RJ tenta logar simultaneamente → B é bloqueado com a mensagem.
- Se B insiste e clica "Sair de lá e entrar aqui" → A é deslogado e perde o trabalho. Tensão social resolve sozinha.
- Em paralelo, sistema registra "device_ids alternando entre SP e RJ a cada 30min" → flag de risco pro admin revisar.

---

## Fora de escopo (decisão consciente)

- Bloqueio automático por geo (decidido: nunca, só alerta).
- 2FA obrigatório em novo dispositivo (pode ser fase 2 se anomalias forem comuns).
- Fingerprinting avançado de navegador (canvas/WebGL) — `device_id` em localStorage já basta; fingerprint adiciona complexidade e risco LGPD.
- Limite por número de dispositivos cadastrados (livre — o limitador é a simultaneidade).
