import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, "Nombre de usuario es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string().min(3, "Nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmar contraseña es requerido"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    const { confirmPassword, terms, ...userData } = values;
    registerMutation.mutate(userData);
  }

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cyberdark p-4"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-cyberdark opacity-80"></div>

      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-cyber font-bold text-white mb-2">
            Cyber<span className="text-cyberaccent">Calc</span>
          </h1>
          <p className="text-gray-300">La forma más divertida de aprender cálculo</p>
        </div>

        <Card className="bg-cyberbg border-cyberprimary cyber-border">
          <CardContent className="p-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-cyberprimary">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-cybersecondary">Crear Cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tu nombre de usuario" 
                              className="bg-cyberdark border-cyberprimary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Tu contraseña" 
                              className="bg-cyberdark border-cyberprimary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="text-sm cursor-pointer">Recordarme</FormLabel>
                          </FormItem>
                        )}
                      />
                      <a href="#" className="text-cyberaccent text-sm hover:underline">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full cyber-btn bg-cyberprimary hover:bg-purple-700"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Iniciar Sesión
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Escoge un nombre de usuario" 
                              className="bg-cyberdark border-cyberprimary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Crea una contraseña" 
                              className="bg-cyberdark border-cyberprimary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirma tu contraseña" 
                              className="bg-cyberdark border-cyberprimary text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm cursor-pointer">
                              Acepto los <a href="#" className="text-cyberaccent hover:underline">términos y condiciones</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full cyber-btn bg-cybersecondary hover:bg-blue-700"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Registrarme
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
