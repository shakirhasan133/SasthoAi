"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import EnhancedHeader from "../../../../components/EnhancedHeader"
import useAuth from "../../../../hooks/use-auth"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { 
  ArrowLeft, Calendar, User, AlertTriangle, Heart, Brain, Eye, 
  Activity, Shield, Stethoscope, Pill, Scissors, Clock, TrendingUp, 
  Globe, Users, BarChart3, ExternalLink 
} from "lucide-react"

export default function RecordDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [record, setRecord] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, you would fetch this from an API
  const mockRecord = {
    _id: id,
    disease_name: 'সাধারণ সর্দি',
    overview: 'উপরের শ্বাসনালীতে ভাইরাসজনিত সংক্রমণ, যা মিউকাস ঝিল্লির প্রদাহ সৃষ্টি করে। এটি মানুষের মধ্যে সবচেয়ে সাধারণ অসুস্থতাগুলোর একটি।',
    causes: ['রাইনোভাইরাস', 'করোনাভাইরাস', 'অ্যাডেনোভাইরাস', 'রেসপিরেটরি সিনসাইটিয়াল ভাইরাস'],
    symptoms: ['নাক দিয়ে পানি পড়া', 'গলা ব্যথা', 'কাশি', 'হাঁচি', 'নাক বন্ধ', 'হালকা জ্বর', 'ক্লান্তি'],
    risk_factors: ['দুর্বল রোগপ্রতিরোধ ক্ষমতা', 'সংক্রমিত ব্যক্তির সংস্পর্শে আসা', 'ঋতু পরিবর্তন', 'পর্যাপ্ত ঘুমের অভাব', 'চাপ'],
    diagnosis: ['শারীরিক পরীক্ষা', 'লক্ষণ মূল্যায়ন', 'চিকিৎসা ইতিহাস', 'দ্রুত অ্যান্টিজেন পরীক্ষা (প্রয়োজনে)'],
    lifestyle_treatments: ['বিশ্রাম', 'প্রচুর পানি পান', 'হিউমিডিফায়ার ব্যবহার', 'লবণ পানিতে গার্গল', 'বাষ্প গ্রহণ'],
    medication_treatments: ['ব্যথানাশক', 'ডিকনজেস্ট্যান্ট', 'কাশির সিরাপ', 'নাকের স্প্রে'],
    therapy_treatments: ['বাষ্প গ্রহণ', 'লবণ পানিতে গার্গল', 'বিশ্রাম থেরাপি'],
    surgery_treatments: [], // Example of an empty section
    prevention: ['হাত ধোয়া', 'মুখে হাত না দেয়া', 'অসুস্থ হলে বাড়িতে থাকা', 'ভাল স্বাস্থ্যবিধি', 'পুষ্টিকর খাদ্য'],
    complications: ['কান সংক্রমণ', 'অ্যাজমা বেড়ে যাওয়া', 'সাইনুসাইটিস', 'ব্রঙ্কাইটিস'],
    stages: ['ইনকিউবেশন (১-৩ দিন)', 'উদ্ভব (১-২ দিন)', 'চূড়ান্ত (৩-৫ দিন)', 'সুস্থতা (৭-১০ দিন)'],
    prognosis: 'চমৎকার, সাধারণত ৭-১০ দিনের মধ্যে বিশ্রাম ও যত্নে সেরে যায়। বেশিরভাগ ক্ষেত্রেই কোনো জটিলতা ছাড়াই সেরে ওঠে।',
    when_to_see_doctor: ['লক্ষণ খারাপ হলে', 'উচ্চ জ্বর', 'শ্বাসকষ্ট', 'দীর্ঘস্থায়ী কাশি', 'তীব্র মাথাব্যথা'],
    emergency_signs: ['তীব্র বুক ব্যথা', 'শ্বাস নিতে কষ্ট', 'উচ্চ জ্বর ও বিভ্রান্তি', 'তীব্র পানিশূন্যতা'],
    related_diseases: ['ফ্লু', 'ব্রঙ্কাইটিস', 'সাইনুসাইটিস', 'ফ্যারিঞ্জাইটিস', 'লারিঞ্জাইটিস'],
    affected_body_parts: ['নাক', 'গলা', 'ফুসফুস', 'কান', 'সাইনাস'],
    global_cases_statistics: 'বিশ্বব্যাপী প্রতি বছর কোটি কোটি মানুষ আক্রান্ত হয়',
    annual_deaths_statistics: 'খুবই কম, মূলত ঝুঁকিপূর্ণ জনগোষ্ঠীতে',
    prevalence_rate_statistics: 'অত্যন্ত বেশি, বেশিরভাগ মানুষ বছরে একাধিকবার আক্রান্ত হয়',
    reference_source: 'সিডিসি - সেন্টারস ফর ডিজিজ কন্ট্রোল অ্যান্ড প্রিভেনশন',
    reference_url: 'https://www.cdc.gov/commoncold/',
    date: '২০২৪-০১-১৫',
    type: 'ম্যানুয়াল এন্ট্রি'
  }

  useEffect(() => {
    // Simulate API call to fetch record details
    setTimeout(() => {
      setRecord(mockRecord)
      setIsLoading(false)
    }, 500)
  }, [id])

  // Loading State
  if (loading || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
        <EnhancedHeader />
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading record details...</p>
        </div>
      </main>
    )
  }

  // Not Logged In State
  if (!user) {
    // Redirect or show a message
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
        <EnhancedHeader />
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need to be logged in to view record details.</p>
           <Button onClick={() => router.push('/login')} className="mt-4">
            Login
          </Button>
        </div>
      </main>
    )
  }
  
  // Record Not Found State
  if (!record) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
        <EnhancedHeader />
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Record Not Found</h1>
          <p>The requested record could not be found.</p>
          <Button onClick={() => router.push('/my-records')} className="mt-4">
            Back to My Records
          </Button>
        </div>
      </main>
    )
  }

  // *** UPDATED HELPER FUNCTION FOR LIST VIEW ***
  // This function now renders a simple bulleted list instead of badges.
  const renderArraySection = (items) => {
    if (!items || items.length === 0) return <p className="text-sm text-gray-500">N/A</p>
    return (
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )
  }
  
  // *** UPDATED HELPER FUNCTION FOR LIST VIEW ***
  // This function now renders each treatment type with its own list.
  const renderTreatmentSection = (title, items, icon) => {
    if (!items || items.length === 0) return null
    return (
      <div className="space-y-1">
        <h3 className="flex items-center text-base font-semibold text-gray-800">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-4">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  // The main component is wrapped in a container that is hidden on medium screens and up (`md:hidden`).
  return (
    <main className="bg-gradient-to-b from-[#F0FDF4] to-white min-h-screen">
      <div className="max-w-md mx-auto px-4 py-5 space-y-5 md:hidden">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/my-records')}
            className="self-start px-3 py-1.5 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{record.disease_name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>{record.date}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1.5" />
                <span>{user?.email}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{record.type}</Badge>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">{record.overview}</p>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.symptoms)}
          </CardContent>
        </Card>

        {/* Causes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2 text-green-600" />
              Causes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.causes)}
          </CardContent>
        </Card>
        
        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-yellow-600" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.risk_factors)}
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Stethoscope className="h-5 w-5 mr-2 text-purple-600" />
              Diagnosis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.diagnosis)}
          </CardContent>
        </Card>

        {/* Treatments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="h-5 w-5 mr-2 text-emerald-600" />
              Treatments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderTreatmentSection("Lifestyle", record.lifestyle_treatments, <Activity className="h-5 w-5 text-emerald-600" />)}
            {renderTreatmentSection("Medications", record.medication_treatments, <Pill className="h-5 w-5 text-blue-600" />)}
            {renderTreatmentSection("Therapies", record.therapy_treatments, <Brain className="h-5 w-5 text-purple-600" />)}
            {/* This section will not render if the array is empty */}
            {renderTreatmentSection("Surgery", record.surgery_treatments, <Scissors className="h-5 w-5 text-red-600" />)}
          </CardContent>
        </Card>

        {/* Prevention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Prevention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.prevention)}
          </CardContent>
        </Card>

        {/* Complications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Complications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.complications)}
          </CardContent>
        </Card>

        {/* Stages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-indigo-600" />
              Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.stages)}
          </CardContent>
        </Card>

        {/* Prognosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
              Prognosis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">{record.prognosis}</p>
          </CardContent>
        </Card>

        {/* When to See Doctor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Stethoscope className="h-5 w-5 mr-2 text-orange-600" />
              When to See a Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.when_to_see_doctor)}
          </CardContent>
        </Card>

        {/* Emergency Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Emergency Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.emergency_signs)}
          </CardContent>
        </Card>
        
        {/* Related Diseases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2 text-violet-600" />
              Related Diseases
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.related_diseases)}
          </CardContent>
        </Card>
        
        {/* Affected Body Parts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="h-5 w-5 mr-2 text-slate-600" />
              Affected Body Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderArraySection(record.affected_body_parts)}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <Globe className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Global Cases</h4>
                <p className="text-sm text-gray-600">{record.global_cases_statistics}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start">
              <Users className="h-5 w-5 mr-3 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Annual Deaths</h4>
                <p className="text-sm text-gray-600">{record.annual_deaths_statistics}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800">Prevalence Rate</h4>
                <p className="text-sm text-gray-600">{record.prevalence_rate_statistics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ExternalLink className="h-5 w-5 mr-2 text-emerald-600" />
              Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">Source:</p>
                <p className="text-sm text-gray-600">{record.reference_source}</p>
              </div>
              {record.reference_url && (
                <div>
                  <p className="text-sm font-semibold text-gray-800">URL:</p>
                  <a 
                    href={record.reference_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {record.reference_url}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* This ensures the content is hidden on screens `md` (768px) and wider */}
      <style jsx global>{`
        @media (min-width: 768px) {
          main > div {
            display: none !important;
          }
        }
      `}</style>
    </main>
  )
}