CREATE TYPE public.app_role AS ENUM ('subscriber', 'admin');

CREATE TABLE public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.user_roles (
  id         UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID             NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role  NOT NULL,
  created_at TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE TABLE public.subscriptions (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT        UNIQUE,
  status                 TEXT        NOT NULL DEFAULT 'inactive',
  price_id               TEXT,
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.downloads_log (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country       TEXT        NOT NULL,
  file_path     TEXT        NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.downloads_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profile_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "roles_select_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "roles_admin_all" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "sub_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sub_service_all" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "dl_insert_own" ON public.downloads_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dl_select_own" ON public.downloads_log
  FOR SELECT USING (auth.uid() = user_id);