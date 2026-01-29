'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WelcomeStep, ThesisStep, AlertStep, TourStep } from '@/components/onboarding/steps'
import { createClient } from '@/lib/supabase/client'
import BrandLogo from '@/components/ui/BrandLogo'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({})
    const router = useRouter()
    const supabase = createClient()

    const handleNext = async (data: any) => {
        const newData = { ...formData, ...data }
        setFormData(newData)

        if (step === 4) {
            // Final step - save data and redirect
            // In a real app, you'd save to Supabase here
            // await supabase.from('profiles').update({ ...newData, onboarding_completed: true }).eq('id', user.id)

            router.push('/dashboard')
        } else {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-800 fixed top-0 left-0 z-50">
                <div
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            {/* Header */}
            <header className="p-6 flex justify-between items-center">
                <BrandLogo textSize="text-xl" />
                <div className="text-sm text-gray-500">
                    Step {step} of 4
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl">
                    {step === 1 && <WelcomeStep onNext={handleNext} />}
                    {step === 2 && <ThesisStep onNext={handleNext} onBack={handleBack} data={formData} />}
                    {step === 3 && <AlertStep onNext={handleNext} onBack={handleBack} data={formData} />}
                    {step === 4 && <TourStep onNext={handleNext} onBack={handleBack} />}
                </div>
            </main>
        </div>
    )
}
