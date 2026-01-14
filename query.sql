SELECT public.user_profiles.name, sum(public.sales_deals.value)
FROM public.sales_deals
INNER JOIN public.user_profiles 
ON public.sales_deals.user_id = public.user_profiles.id
GROUP BY public.user_profiles.name