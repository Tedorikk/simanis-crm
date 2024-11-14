import {login, signup} from "./action"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tabs defaultValue="account" className="w-[320px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="loginpage">Log In</TabsTrigger>
        <TabsTrigger value="signinpage">Sign In</TabsTrigger>
      </TabsList>
      <TabsContent value="loginpage">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Selamat Datang!</CardTitle>
          <CardDescription>Masukkan informasi akun anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4 flex-col">
            <Input type="email" placeholder="Email" id="email" name="email" required/>
            <Input type="password" placeholder="Password" id="password" name="password" required/>
            <Button formAction={login}>Log in</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p>SIMANIS - CRM</p>
        </CardFooter>
      </Card>
      </TabsContent>
      <TabsContent value="signinpage">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Selamat Datang!</CardTitle>
          <CardDescription>Masukkan informasi akun anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4 flex-col">
            <Input type="email" placeholder="Email" id="email" name="email" required/>
            <Input type="password" placeholder="Password" id="password" name="password" required/>
            <Button formAction={signup}>Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p>SIMANIS - CRM</p>
        </CardFooter>
      </Card>
      </TabsContent>
      </Tabs>
    </div>
  )
}