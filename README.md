## Getting Started

* #### From the command line inside the `docker` folder copy the `.env.example` to `.env` file. Change environment variables to your preference or keep the same if you are just trying it out. Leave everything the same for quick start.

* ### From the command line inside the `docker` folder run 
    * `docker compose -f docker-compose.yml -f ./dev/docker-compose.dev.yml up -d` to spin up the local Supabase instance.

* ### Login to the local Supabase instance at `http://localhost:8000` with username `supabase` and password `this_password_is_insecure_and_should_be_updated`.

* ### Run Create Profile Table Script

    * Once logged in to the dashboard click the link on the left and go to where you can run SQL scripts and run this script below

    * ``` 
        create table public.profiles (
        id uuid not null,
        email text unique,
        constraint profiles_pkey primary key (id)
        ) tablespace pg_default;

         -- Turn on security
        alter table public.profiles
        enable row level security;

        create policy "Admin" on "public"."profiles" as permissive for all to authenticated using (true);
      ```


* ### Run Create Todos Table Script
   
    * ``` sql
        create type status_types as enum (
          'TODO',
          'IN_PROGRESS',
          'DONE'
        );

        create table
        public.todos_group (
          id uuid not null default gen_random_uuid (),
          group_name text null,
          created_at timestamp with time zone not null default now(),
          constraint todos_group_pkey primary key (id)
        ) tablespace pg_default;

        create table
        public.todos (
          id uuid not null default gen_random_uuid (),
          title text not null,
          description text null,
          status public.status_types not null default 'TODO'::status_types,
          img_path text null,
          is_edited boolean null default false,
          user_id uuid null,
          created_at timestamp with time zone not null default now(),
          group_id uuid not null,
          constraint todo_pkey primary key (id),
          constraint todo_users_fkey foreign key (user_id) references profiles (id) on update cascade on delete cascade,
          constraint public_todos_group_id_fkey foreign key (group_id) references todos_group (id) on delete cascade
        ) tablespace pg_default;       

        -- Turn on security
        alter table "todos"
        enable row level security;

        alter table "todos_group"
        enable row level security;

        create policy "Allow anonymous access" on "public"."todos_group" as permissive for all to anon, authenticated using (true);
    
        -- Allow anonymous access
        create policy "Allow anonymous access"
        on todos
        for all
        to anon, authenticated
        using (true);
    
        -- Turn on real-time
        alter publication supabase_realtime add table todos
        alter publication supabase_realtime add table todos_group

      
      ```

* ### Run Create Trigger Script for Auth Users to Profiles Table

    *   ``` 
        -- inserts a row into public.profiles
        create function public.handle_new_user()
        returns trigger
        language plpgsql
        security definer set search_path = public
        as $$
        begin
          insert into public.profiles (id, email)
          values (new.id, new.raw_user_meta_data ->> 'email');
          return new;
        end;
        $$;
        
        -- trigger the function every time a user is created
          create trigger on_auth_user_created
          after insert on auth.users
          for each row execute procedure public.handle_new_user();        
        ```    
* ### Run Create Storage Script

    *   ``` 
        insert into storage.buckets
          (id, name, public)
        values
          ('todo-img', 'todo-img', false);

        CREATE POLICY "Enable all access for anon and authenticated users" ON "storage"."objects"
        AS PERMISSIVE FOR ALL
        TO anon, authenticated
        USING (true);

        CREATE POLICY "Enable all for anon and authenticated users" ON "storage"."buckets"
        AS PERMISSIVE FOR ALL
        TO authenticated, anon
        WITH CHECK (true);

        ```    


* ### Click on the `Authentication` icon on the left horizontal bar and click `Users` and create 2 or more users for the chat application.

* ### In the command line at the root directory install packages with `bun`, `pnpm` or whatever you use.

* ### Run the development server:

    * ```bash
        npm run dev
        # or
        yarn dev
        # or
        pnpm dev
        # or
        bun dev
        ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

[ ] fallback loading
[ ] Edit
[ ] Delete Message
[ ] Realtime listener
[ ] Pagination  

```
curl 'https://exdezzoyljbzksrsnfqc.supabase.co/rest/v1/profile?select=*' \
-H "apikey: SUPABASE_CLIENT_ANON_KEY" \
-H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY"
```



<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This%20starter%20configures%20Supabase%20Auth%20to%20use%20cookies%2C%20making%20the%20user's%20session%20available%20throughout%20the%20entire%20Next.js%20app%20-%20Client%20Components%2C%20Server%20Components%2C%20Route%20Handlers%2C%20Server%20Actions%20and%20Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)