-- trigger function (what happens, into where, with?)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, name, account_type) -- columns
  value (
    new.id,
    new.raw_user_meta_data ->> 'name'
    new.raw_user_meta_data ->> 'account_type'
  );
  return new; --row that cause trigger to fire
end;
$$;

-- trigger object (when, after/before?)
create trigger on_auth_user_created
  after insert on auth.users 
  for each row
  execute procedure public.handle_new_user();


  /************
  ************/

  CREATE policy "Reps can only add their own deals"
  ON public.sales_deals
  FOR insert
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.account_type = 'rep'
    )
  );

  CREATE policy "Admin to add to anyone's deals"
  ON public.sales_deals
  FOR insert
  TO authenticated
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.account_type = 'admin'
    )
  )