import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AuthChangeEvent } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User already authenticated:", session.user.id);
        navigate("/");
      }
    };
    
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        console.log("User authenticated:", session.user.id);
        navigate("/");
      }
      
      if (event === "SIGNED_OUT") {
        console.log("User signed out");
      }

      // Handle registration and login errors
      if (event === "USER_UPDATED" && !session) {
        toast.error("Authentication failed. Please try again.");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome to MutualFund App
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your portfolio
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          localization={{
            variables: {
              sign_up: {
                button_label: "Sign up",
                email_label: "Email",
                password_label: "Create a Password (minimum 6 characters)",
                loading_button_label: "Creating account ...",
                social_provider_text: "Sign in with",
                confirmation_text: "Check your email for the confirmation link",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;