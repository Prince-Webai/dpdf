'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account settings and preferences.</p>
            </div>

            <Separator className="bg-white/10" />

            <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription className="text-gray-400">Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="John" className="bg-black border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" className="bg-black border-white/10 text-white" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-black border-white/10 text-white" disabled />
                        <p className="text-xs text-gray-500">To change your email, please contact support.</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
                </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription className="text-gray-400">Manage your subscription and payment methods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-white">Hobby Plan</p>
                            <p className="text-sm text-gray-400">100 API calls / month limit</p>
                        </div>
                        <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">Upgrade</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-red-950/20 border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription className="text-red-400/80">Irreversible account actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    )
}
