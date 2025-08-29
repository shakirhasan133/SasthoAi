"use client"
import { useState, useEffect } from "react"
import EnhancedHeader from "../../../components/EnhancedHeader"
import useAuth from "../../../hooks/use-auth"
import { Button } from "../../../components/ui/button"
import { PlusCircle, Wand2, Calendar, User, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Badge } from "../../../components/ui/badge"
import { useRouter } from "next/navigation"

export default function MyRecordsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAutoFilling, setIsAutoFilling] = useState(false) // New state for AI autofill loading
  
  const initialFormData = {
    disease_name: '',
    overview: '',
    causes: [],
    symptoms: [],
    risk_factors: [],
    diagnosis: [],
    lifestyle_treatments: [],
    medication_treatments: [],
    therapy_treatments: [],
    surgery_treatments: [],
    prevention: [],
    complications: [],
    stages: [],
    prognosis: '',
    when_to_see_doctor: [],
    emergency_signs: [],
    related_diseases: [],
    affected_body_parts: [],
    global_cases_statistics: '',
    annual_deaths_statistics: '',
    prevalence_rate_statistics: '',
    reference_source: '',
    reference_url: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // States for individual array inputs
  const [newCause, setNewCause] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [newRiskFactor, setNewRiskFactor] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newLifestyleTreatment, setNewLifestyleTreatment] = useState('');
  const [newMedicationTreatment, setNewMedicationTreatment] = useState('');
  const [newTherapyTreatment, setNewTherapyTreatment] = useState('');
  const [newSurgeryTreatment, setNewSurgeryTreatment] = useState('');
  const [newPrevention, setNewPrevention] = useState('');
  const [newComplication, setNewComplication] = useState('');
  const [newStage, setNewStage] = useState('');
  const [newWhenToSeeDoctor, setNewWhenToSeeDoctor] = useState('');
  const [newEmergencySign, setNewEmergencySign] = useState('');
  const [newRelatedDisease, setNewRelatedDisease] = useState('');
  const [newAffectedBodyPart, setNewAffectedBodyPart] = useState('');

  // Updated dummy data to match form structure (Bangla content)
  const dummyRecords = [
    {
      _id: 'dummy1',
      disease_name: 'সাধারণ সর্দি',
      overview: 'উপরের শ্বাসনালীতে ভাইরাস সংক্রমণ, যা মিউকাস ঝিল্লির প্রদাহ সৃষ্টি করে।',
      causes: ['রাইনোভাইরাস', 'করোনাভাইরাস', 'অ্যাডেনোভাইরাস'],
      symptoms: ['নাক দিয়ে পানি পড়া', 'গলা ব্যথা', 'কাশি', 'হাঁচি', 'নাক বন্ধ'],
      risk_factors: ['দুর্বল রোগপ্রতিরোধ ক্ষমতা', 'সংক্রমিত ব্যক্তির সংস্পর্শ', 'ঋতু পরিবর্তন'],
      diagnosis: ['শারীরিক পরীক্ষা', 'লক্ষণ মূল্যায়ন', 'চিকিৎসা ইতিহাস'],
      lifestyle_treatments: ['বিশ্রাম', 'প্রচুর পানি পান', 'হিউমিডিফায়ার ব্যবহার'],
      medication_treatments: ['ব্যথানাশক', 'ডিকনজেস্ট্যান্ট', 'কাশির সিরাপ'],
      therapy_treatments: ['ভাপ নেওয়া', 'লবণ পানি দিয়ে গার্গল'],
      surgery_treatments: [],
      prevention: ['হাত ধোয়া', 'মুখে হাত না দেওয়া', 'অসুস্থ হলে বাড়িতে থাকা'],
      complications: ['কান সংক্রমণ', 'অ্যাজমা বৃদ্ধি', 'সাইনোসাইটিস'],
      stages: ['ইনকিউবেশন', 'শুরু', 'চূড়ান্ত', 'সুস্থতা'],
      prognosis: 'চমৎকার, সাধারণত ৭-১০ দিনের মধ্যে বিশ্রাম ও যত্নে সেরে যায়।',
      when_to_see_doctor: ['লক্ষণ খারাপ হলে', 'উচ্চ জ্বর', 'শ্বাসকষ্ট', 'দীর্ঘস্থায়ী কাশি'],
      emergency_signs: ['তীব্র বুক ব্যথা', 'শ্বাস নিতে কষ্ট', 'উচ্চ জ্বর ও বিভ্রান্তি'],
      related_diseases: ['ফ্লু', 'ব্রঙ্কাইটিস', 'সাইনোসাইটিস'],
      affected_body_parts: ['নাক', 'গলা', 'ফুসফুস', 'কান'],
      global_cases_statistics: 'বিশ্বব্যাপী প্রতিবছর কোটি কোটি মানুষ আক্রান্ত',
      annual_deaths_statistics: 'খুবই কম, মূলত ঝুঁকিপূর্ণদের মধ্যে',
      prevalence_rate_statistics: 'খুব বেশি, অধিকাংশ মানুষ বছরে একাধিকবার আক্রান্ত হয়',
      reference_source: 'সিডিসি - সেন্টারস ফর ডিজিজ কন্ট্রোল অ্যান্ড প্রিভেনশন',
      reference_url: 'https://www.cdc.gov/commoncold/',
      date: '2024-01-15',
      type: 'ম্যানুয়াল এন্ট্রি'
    },
    {
      _id: 'dummy2',
      disease_name: 'ঋতুকালীন অ্যালার্জি',
      overview: 'পরিবেশগত অ্যালার্জেন যেমন পরাগ, ধুলা, পোষা প্রাণীর লোম ইত্যাদির প্রতি অ্যালার্জিক প্রতিক্রিয়া।',
      causes: ['পরাগ', 'ধুলা', 'পোষা প্রাণীর লোম', 'ছাঁচের স্পোর'],
      symptoms: ['হাঁচি', 'চুলকানি চোখ', 'নাক বন্ধ', 'নাক দিয়ে পানি পড়া', 'গলা দিয়ে পানি পড়া'],
      risk_factors: ['অ্যালার্জির পারিবারিক ইতিহাস', 'অ্যাজমা', 'একজিমা', 'শহরে বসবাস'],
      diagnosis: ['ত্বকে চামচিক পরীক্ষা', 'রক্ত পরীক্ষা', 'নাক পরীক্ষা', 'অ্যালার্জির ইতিহাস'],
      lifestyle_treatments: ['অ্যালার্জেন এড়ানো', 'নাক ধোয়া', 'HEPA ফিল্টার', 'নিয়মিত পরিষ্কার'],
      medication_treatments: ['অ্যান্টিহিস্টামিন', 'নাকের কর্টিকোস্টেরয়েড', 'ডিকনজেস্ট্যান্ট'],
      therapy_treatments: ['ইমিউনোথেরাপি (অ্যালার্জি শট)', 'সাবলিঙ্গুয়াল ইমিউনোথেরাপি'],
      surgery_treatments: ['টারবিনেট রিডাকশন (দুর্লভ ক্ষেত্রে)'],
      prevention: ['পরাগ গণনা পর্যবেক্ষণ', 'জানালা বন্ধ রাখা', 'এয়ার পিউরিফায়ার ব্যবহার'],
      complications: ['সাইনোসাইটিস', 'কান সংক্রমণ', 'অ্যাজমা বৃদ্ধি'],
      stages: ['শুরুর মৌসুম', 'চূড়ান্ত মৌসুম', 'শেষ মৌসুম'],
      prognosis: 'চিকিৎসায় নিয়ন্ত্রণযোগ্য, দীর্ঘস্থায়ী কিন্তু সময়ের সাথে উন্নতি হতে পারে।',
      when_to_see_doctor: ['লক্ষণ গুরুতর হলে', 'ওষুধে কাজ না হলে', 'অ্যাজমার লক্ষণ'],
      emergency_signs: ['অ্যানাফাইল্যাক্সিস (দুর্লভ)', 'তীব্র শ্বাসকষ্ট'],
      related_diseases: ['অ্যাজমা', 'একজিমা', 'সাইনোসাইটিস'],
      affected_body_parts: ['নাক', 'চোখ', 'গলা', 'ফুসফুস', 'চামড়া'],
      global_cases_statistics: 'বিশ্বব্যাপী প্রতিবছর শত কোটি মানুষ আক্রান্ত',
      annual_deaths_statistics: 'খুবই কম, মূলত গুরুতর প্রতিক্রিয়ায়',
      prevalence_rate_statistics: 'উচ্চ, বিশ্ব জনসংখ্যার ১০-৩০% আক্রান্ত',
      reference_source: 'মায়ো ক্লিনিক',
      reference_url: 'https://www.mayoclinic.org/diseases-conditions/hay-fever/',
      date: '2024-01-20',
      type: 'ম্যানুয়াল এন্ট্রি'
    },
    {
      _id: 'dummy3',
      disease_name: 'টাইপ ২ ডায়াবেটিস',
      overview: 'একটি দীর্ঘস্থায়ী বিপাকীয় রোগ, যেখানে ইনসুলিন প্রতিরোধের কারণে রক্তে শর্করার মাত্রা বেড়ে যায়।',
      causes: ['স্থূলতা', 'শারীরিক নিষ্ক্রিয়তা', 'অস্বাস্থ্যকর খাদ্যাভ্যাস', 'জেনেটিক কারণ'],
      symptoms: ['অতিরিক্ত পিপাসা', 'বারবার প্রস্রাব', 'ক্লান্তি', 'দৃষ্টির অস্পষ্টতা'],
      risk_factors: ['পারিবারিক ইতিহাস', '৪৫ বছরের বেশি বয়স', 'অলস জীবনযাপন', 'অস্বাস্থ্যকর খাদ্য'],
      diagnosis: ['রক্তে গ্লুকোজ পরীক্ষা', 'A1C পরীক্ষা', 'ওরাল গ্লুকোজ টলারেন্স টেস্ট'],
      lifestyle_treatments: ['খাদ্যাভ্যাস পরিবর্তন', 'নিয়মিত ব্যায়াম', 'ওজন নিয়ন্ত্রণ'],
      medication_treatments: ['মেটফরমিন', 'সালফোনিলিউরিয়া', 'DPP-4 ইনহিবিটর'],
      therapy_treatments: ['ডায়াবেটিস শিক্ষা', 'পুষ্টি পরামর্শ', 'ব্যায়াম কর্মসূচি'],
      surgery_treatments: ['বাড়তি স্থূলতার জন্য ব্যারিয়াট্রিক সার্জারি'],
      prevention: ['স্বাস্থ্যকর খাদ্য', 'নিয়মিত ব্যায়াম', 'ওজন নিয়ন্ত্রণ'],
      complications: ['হৃদরোগ', 'কিডনি ক্ষতি', 'চোখের ক্ষতি', 'নার্ভ ক্ষতি'],
      stages: ['প্রিডায়াবেটিস', 'প্রাথমিক ডায়াবেটিস', 'উন্নত ডায়াবেটিস'],
      prognosis: 'সঠিক চিকিৎসা ও জীবনযাপনে নিয়ন্ত্রণযোগ্য।',
      when_to_see_doctor: ['রক্তে শর্করা বেড়ে গেলে', 'জটিলতার লক্ষণ', 'ওষুধের পার্শ্বপ্রতিক্রিয়া'],
      emergency_signs: ['খুব বেশি রক্তে শর্করা', 'ডায়াবেটিক কিটোঅ্যাসিডোসিসের লক্ষণ'],
      related_diseases: ['হাইপারটেনশন', 'হৃদরোগ', 'কিডনি রোগ'],
      affected_body_parts: ['অগ্ন্যাশয়', 'হৃদয়', 'কিডনি', 'চোখ', 'নার্ভ'],
      global_cases_statistics: 'বিশ্বব্যাপী ৫০ কোটির বেশি মানুষ আক্রান্ত',
      annual_deaths_statistics: 'প্রতি বছর ১৫ লক্ষাধিক মৃত্যু',
      prevalence_rate_statistics: 'বিশ্ব জনসংখ্যার ৮-১০% আক্রান্ত',
      reference_source: 'বিশ্ব স্বাস্থ্য সংস্থা',
      reference_url: 'https://www.who.int/health-topics/diabetes',
      date: '2024-01-25',
      type: 'ম্যানুয়াল এন্ট্রি'
    }
  ]

  useEffect(() => {
    setRecords(dummyRecords);
    setIsLoading(false);
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Generic add function for array fields
  const handleAddItem = (fieldName, newItem, setNewItemState) => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], newItem.trim()],
      }));
      setNewItemState('');
    }
  };

  // Generic remove function for array fields
  const handleRemoveItem = (fieldName, indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAutoFillWithAI = async () => {
    if (!formData.disease_name.trim()) {
      alert("Please enter a Disease Name to auto-fill.");
      return;
    }

    setIsAutoFilling(true);
    console.log("Attempting to auto-fill with AI for disease:", formData.disease_name);
    try {
      const res = await fetch('/api/ai/autofill-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diseaseName: formData.disease_name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error during auto-fill:", res.status, errorData);
        alert(`Failed to auto-fill: ${errorData.error || res.statusText}. Please try again or fill manually.`);
        return;
      }

      const aiData = await res.json();
      console.log("AI Auto-fill successful. Received data:", aiData);
      
      // Update formData with AI data
      setFormData(prev => ({
        ...prev,
        ...aiData,
        // Ensure nested objects are correctly merged/overwritten, handling potential undefineds
        treatments: {
          ...prev.treatments,
          ...(aiData.treatments || {}),
          lifestyle: aiData.treatments?.lifestyle || [],
          medications: aiData.treatments?.medications || [],
          therapies: aiData.treatments?.therapies || [],
          surgery: aiData.treatments?.surgery || [],
        },
        statistics: {
          ...prev.statistics,
          ...(aiData.statistics || {}),
          global_cases: aiData.statistics?.global_cases || '',
          annual_deaths: aiData.statistics?.annual_deaths || '',
          prevalence_rate: aiData.statistics?.prevalence_rate || '',
        },
        references: aiData.references || [],

        // Explicitly setting array fields to ensure they are arrays, even if AI response has empty or missing ones
        causes: aiData.causes || [],
        symptoms: aiData.symptoms || [],
        risk_factors: aiData.risk_factors || [],
        diagnosis: aiData.diagnosis || [],
        prevention: aiData.prevention || [],
        complications: aiData.complications || [],
        stages: aiData.stages || [],
        when_to_see_doctor: aiData.when_to_see_doctor || [],
        emergency_signs: aiData.emergency_signs || [],
        related_diseases: aiData.related_diseases || [],
        affected_body_parts: aiData.affected_body_parts || [],
      }));

      // Reset individual input states after autofill
      setNewCause('');
      setNewSymptom('');
      setNewRiskFactor('');
      setNewDiagnosis('');
      setNewLifestyleTreatment('');
      setNewMedicationTreatment('');
      setNewTherapyTreatment('');
      setNewSurgeryTreatment('');
      setNewPrevention('');
      setNewComplication('');
      setNewStage('');
      setNewWhenToSeeDoctor('');
      setNewEmergencySign('');
      setNewRelatedDisease('');
      setNewAffectedBodyPart('');

    } catch (error) {
      console.error("Error during AI auto-fill:", error);
      alert("Error during AI auto-fill. Please check the console for details.");
    } finally {
      setIsAutoFilling(false);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      userId: user.id, // Assuming user object has an ID
      ...formData,
      // No filtering of arrays or objects
      causes: formData.causes,
      symptoms: formData.symptoms,
      risk_factors: formData.risk_factors,
      diagnosis: formData.diagnosis,
      prevention: formData.prevention,
      complications: formData.complications,
      stages: formData.stages,
      when_to_see_doctor: formData.when_to_see_doctor,
      emergency_signs: formData.emergency_signs,
      related_diseases: formData.related_diseases,
      affected_body_parts: formData.affected_body_parts,
    }


    // For date and type fields
    payload.date = new Date().toISOString().split('T')[0]; // Add current date
    payload.type = 'Manual Entry'; // Or a different default type

    const request = await fetch(`${NEXT_PUBLIC_SERVER_URL}/records`)
    const data = await request.json()
    console.log(data)
    
  }



  
  const handleViewDetails = (recordId) => {
    router.push(`/my-records/${recordId}`);
  };

  if (loading || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
        <EnhancedHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
        <EnhancedHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">My Records</h1>
          <p>You need to be logged in to see your records.</p>
        </div>
      </main>
    )
  }

  // Bangla label/placeholder map
  const bnLabels = {
    disease_name: "রোগের নাম",
    overview: "সংক্ষিপ্ত বিবরণ",
    causes: "কারণসমূহ",
    symptoms: "লক্ষণসমূহ",
    risk_factors: "ঝুঁকিপূর্ণ কারণসমূহ",
    diagnosis: "নির্ণয় পদ্ধতি",
    lifestyle_treatments: "জীবনধারা পরিবর্তন",
    medication_treatments: "ঔষধ",
    therapy_treatments: "থেরাপি",
    surgery_treatments: "সার্জারি",
    prevention: "প্রতিরোধ",
    complications: "জটিলতা",
    stages: "পর্যায়সমূহ",
    prognosis: "প্রত্যাশিত ফলাফল",
    when_to_see_doctor: "কখন ডাক্তার দেখাবেন",
    emergency_signs: "জরুরি লক্ষণ",
    related_diseases: "সম্পর্কিত রোগ",
    affected_body_parts: "প্রভাবিত অঙ্গসমূহ",
    global_cases_statistics: "বিশ্বব্যাপী আক্রান্তের সংখ্যা",
    annual_deaths_statistics: "বার্ষিক মৃত্যুর সংখ্যা",
    prevalence_rate_statistics: "প্রাদুর্ভাবের হার",
    reference_source: "তথ্যসূত্র",
    reference_url: "তথ্যসূত্রের লিংক",
  };

  const bnArrayAdd = {
    causes: "যোগ করুন",
    symptoms: "যোগ করুন",
    risk_factors: "যোগ করুন",
    diagnosis: "যোগ করুন",
    lifestyle_treatments: "যোগ করুন",
    medication_treatments: "যোগ করুন",
    therapy_treatments: "যোগ করুন",
    surgery_treatments: "যোগ করুন",
    prevention: "যোগ করুন",
    complications: "যোগ করুন",
    stages: "যোগ করুন",
    when_to_see_doctor: "যোগ করুন",
    emergency_signs: "যোগ করুন",
    related_diseases: "যোগ করুন",
    affected_body_parts: "যোগ করুন",
  };

  const renderArrayInput = (fieldName, placeholder, currentItem, setCurrentItem, arrayData) => (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{bnLabels[fieldName] || placeholder}:</Label>
      <div className="flex items-center space-x-2">
        <Input
          id={fieldName}
          name={fieldName}
          placeholder={bnLabels[fieldName] || placeholder}
          value={currentItem}
          onChange={(e) => setCurrentItem(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddItem(fieldName, currentItem, setCurrentItem);
            }
          }}
          className="rounded-md shadow-sm"
        />
        <Button
          type="button"
          onClick={() => handleAddItem(fieldName, currentItem, setCurrentItem)}
          className="shrink-0"
        >
          {bnArrayAdd[fieldName] || "যোগ করুন"}
        </Button>
      </div>
      {arrayData && arrayData.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {arrayData.map((item, index) => (
            <span key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-sm font-medium">
              {item}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(fieldName, index)}
                className="ml-1 h-auto p-0.5 text-blue-600 hover:bg-blue-200"
              >
                &times;
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );


  return (
    <main className="bg-gradient-to-b from-[#F0FDF4] to-white min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">আমার স্বাস্থ্য রেকর্ড</h1>
            <p className="text-gray-600">আপনার স্বাস্থ্য সংক্রান্ত তথ্য সংরক্ষণ ও ট্র্যাক করুন</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <PlusCircle className="mr-2 h-5 w-5" />
                নতুন রেকর্ড যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>নতুন স্বাস্থ্য রেকর্ড যোগ করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="disease_name">{bnLabels.disease_name}:</Label>
                  <Input name="disease_name" placeholder={bnLabels.disease_name} value={formData.disease_name} onChange={handleFormChange} required className="rounded-md shadow-sm" />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAutoFillWithAI} 
                  disabled={isAutoFilling || !formData.disease_name.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-soft"
                >
                  {isAutoFilling ? 'স্বয়ংক্রিয়ভাবে পূরণ হচ্ছে...' : <><Wand2 className="mr-2 h-4 w-4" /> এআই দিয়ে স্বয়ংক্রিয় পূরণ</>}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="overview">{bnLabels.overview}:</Label>
                  <Textarea name="overview" placeholder={bnLabels.overview} value={formData.overview} onChange={handleFormChange} required className="rounded-md shadow-sm" />
                </div>
                
                {renderArrayInput('causes', bnLabels.causes, newCause, setNewCause, formData.causes)}
                {renderArrayInput('symptoms', bnLabels.symptoms, newSymptom, setNewSymptom, formData.symptoms)}
                {renderArrayInput('risk_factors', bnLabels.risk_factors, newRiskFactor, setNewRiskFactor, formData.risk_factors)}
                {renderArrayInput('diagnosis', bnLabels.diagnosis, newDiagnosis, setNewDiagnosis, formData.diagnosis)}

                <h3 className="font-semibold text-lg mt-4">চিকিৎসা</h3>
                {renderArrayInput('lifestyle_treatments', bnLabels.lifestyle_treatments, newLifestyleTreatment, setNewLifestyleTreatment, formData.lifestyle_treatments)}
                {renderArrayInput('medication_treatments', bnLabels.medication_treatments, newMedicationTreatment, setNewMedicationTreatment, formData.medication_treatments)}
                {renderArrayInput('therapy_treatments', bnLabels.therapy_treatments, newTherapyTreatment, setNewTherapyTreatment, formData.therapy_treatments)}
                {renderArrayInput('surgery_treatments', bnLabels.surgery_treatments, newSurgeryTreatment, setNewSurgeryTreatment, formData.surgery_treatments)}

                {renderArrayInput('prevention', bnLabels.prevention, newPrevention, setNewPrevention, formData.prevention)}
                {renderArrayInput('complications', bnLabels.complications, newComplication, setNewComplication, formData.complications)}
                {renderArrayInput('stages', bnLabels.stages, newStage, setNewStage, formData.stages)}
                
                <div className="space-y-2">
                  <Label htmlFor="prognosis">{bnLabels.prognosis}:</Label>
                  <Textarea name="prognosis" placeholder={bnLabels.prognosis} value={formData.prognosis} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>

                {renderArrayInput('when_to_see_doctor', bnLabels.when_to_see_doctor, newWhenToSeeDoctor, setNewWhenToSeeDoctor, formData.when_to_see_doctor)}
                {renderArrayInput('emergency_signs', bnLabels.emergency_signs, newEmergencySign, setNewEmergencySign, formData.emergency_signs)}
                {renderArrayInput('related_diseases', bnLabels.related_diseases, newRelatedDisease, setNewRelatedDisease, formData.related_diseases)}
                {renderArrayInput('affected_body_parts', bnLabels.affected_body_parts, newAffectedBodyPart, setNewAffectedBodyPart, formData.affected_body_parts)}

                <h3 className="font-semibold text-lg mt-4">পরিসংখ্যান</h3>
                <div className="space-y-2">
                  <Label htmlFor="global_cases_statistics">{bnLabels.global_cases_statistics}:</Label>
                  <Input name="global_cases_statistics" placeholder={bnLabels.global_cases_statistics} value={formData.global_cases_statistics} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_deaths_statistics">{bnLabels.annual_deaths_statistics}:</Label>
                  <Input name="annual_deaths_statistics" placeholder={bnLabels.annual_deaths_statistics} value={formData.annual_deaths_statistics} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prevalence_rate_statistics">{bnLabels.prevalence_rate_statistics}:</Label>
                  <Input name="prevalence_rate_statistics" placeholder={bnLabels.prevalence_rate_statistics} value={formData.prevalence_rate_statistics} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>

                <h3 className="font-semibold text-lg mt-4">তথ্যসূত্র</h3>
                <div className="space-y-2">
                  <Label htmlFor="reference_source">{bnLabels.reference_source}:</Label>
                  <Input name="reference_source" placeholder={bnLabels.reference_source} value={formData.reference_source} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference_url">{bnLabels.reference_url}:</Label>
                  <Input name="reference_url" placeholder={bnLabels.reference_url} value={formData.reference_url} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-soft">সংরক্ষণ করুন</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {records.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {records.map(record => (
              <Card key={record._id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm" onClick={() => handleViewDetails(record._id)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {record.disease_name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {record.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {record.date}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {user?.email}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {record.overview && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {record.overview}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    {record.symptoms && record.symptoms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">মূল লক্ষণসমূহ:</h4>
                        <div className="flex flex-wrap gap-1">
                          {record.symptoms.slice(0, 3).map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {symptom}
                            </Badge>
                          ))}
                          {record.symptoms.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                              +{record.symptoms.length - 3} আরও
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {record.causes && record.causes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">প্রধান কারণসমূহ:</h4>
                        <div className="flex flex-wrap gap-1">
                          {record.causes.slice(0, 2).map((cause, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {cause}
                            </Badge>
                          ))}
                          {record.causes.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                              +{record.causes.length - 2} আরও
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(record._id);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      বিস্তারিত দেখুন
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">এখনো কোনো রেকর্ড নেই</h3>
              <p className="text-gray-500 mb-6">আপনার প্রথম স্বাস্থ্য রেকর্ড যোগ করে শুরু করুন।</p>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                প্রথম রেকর্ড যোগ করুন
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}