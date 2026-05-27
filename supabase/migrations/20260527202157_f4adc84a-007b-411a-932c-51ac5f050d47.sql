
REVOKE EXECUTE ON FUNCTION public.claim_session(text, text, text, text, text, text, text, double precision, double precision) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.heartbeat_session(text, text, text, text, text, double precision, double precision) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.release_session(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.release_other_sessions(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.list_my_devices() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.detect_geo_anomalies(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_session_events() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_pro(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.claim_session(text, text, text, text, text, text, text, double precision, double precision) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.heartbeat_session(text, text, text, text, text, double precision, double precision) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.release_session(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.release_other_sessions(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.list_my_devices() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.detect_geo_anomalies(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_session_events() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_pro(uuid) TO authenticated, service_role;

ALTER FUNCTION public.haversine_km(double precision, double precision, double precision, double precision) SET search_path = public;
