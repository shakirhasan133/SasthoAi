"use client"
import { useState, useEffect } from "react"
import EnhancedHeader from "../../components/EnhancedHeader"
import useAuth from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"
import { PlusCircle, Wand2 } from "lucide-react" // Added Wand2 icon for AI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label" // Import Label for better form semantics

export default function MyRecordsPage() {
  const { user, loading } = useAuth()
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

  // Dummy data for demonstration
  const dummyRecords = [
    {
      _id: 'dummy1',
      disease_name: 'Common Cold',
      overview: 'A viral infection of the upper respiratory tract.',
      causes: ['Rhinovirus', 'Coronavirus'],
      symptoms: ['runny nose', 'sore throat', 'cough', 'sneezing'],
      risk_factors: ['Weakened immune system', 'Close contact with infected individuals'],
      diagnosis: ['Physical exam', 'Symptoms assessment'],
      treatments: {
        lifestyle: ['Rest', 'Fluids'],
        medications: ['Pain relievers', 'Decongestants'],
        therapies: [],
        surgery: []
      },
      prevention: ['Hand washing', 'Avoid touching face'],
      complications: ['Ear infection', 'Asthma exacerbation'],
      stages: [],
      prognosis: 'Excellent, typically resolves in 7-10 days.',
      when_to_see_doctor: ['Symptoms worsen', 'High fever', 'Shortness of breath'],
      emergency_signs: ['Severe chest pain', 'Difficulty breathing'],
      related_diseases: ['Flu', 'Bronchitis'],
      affected_body_parts: ['Nose', 'Throat', 'Lungs'],
      statistics: {
        global_cases: 'Billions annually',
        annual_deaths: 'Low',
        prevalence_rate: 'Very High'
      },
      references: [
        { source: 'CDC', url: 'https://www.cdc.gov/commoncold/' }
      ]
    },
    {
      _id: 'dummy2',
      disease_name: 'Seasonal Allergies',
      overview: 'An allergic response to pollen or other environmental allergens.',
      causes: ['Pollen', 'Dust mites', 'Pet dander'],
      symptoms: ['sneezing', 'itchy eyes', 'nasal congestion', 'runny nose'],
      risk_factors: ['Family history of allergies', 'Asthma'],
      diagnosis: ['Skin prick test', 'Blood test'],
      treatments: {
        lifestyle: ['Avoid allergens', 'Nasal rinses'],
        medications: ['Antihistamines', 'Nasal corticosteroids'],
        therapies: ['Immunotherapy (allergy shots)'],
        surgery: []
      },
      prevention: ['Monitor pollen counts', 'Keep windows closed'],
      complications: ['Sinusitis', 'Ear infections'],
      stages: [],
      prognosis: 'Manageable with treatment, chronic condition.',
      when_to_see_doctor: ['Symptoms severe', 'Over-the-counter medication ineffective'],
      emergency_signs: ['Anaphylaxis (rare)'],
      related_diseases: ['Asthma', 'Eczema'],
      affected_body_parts: ['Nose', 'Eyes', 'Throat'],
      statistics: {
        global_cases: 'Hundreds of millions annually',
        annual_deaths: 'Very Low',
        prevalence_rate: 'High'
      },
      references: [
        { source: 'Mayo Clinic', url: 'https://www.mayoclinic.org/diseases-conditions/hay-fever/symptoms-causes/' }
      ]
    },
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
      // Filter out empty arrays for top-level array fields
      causes: formData.causes.filter(Boolean),
      symptoms: formData.symptoms.filter(Boolean),
      risk_factors: formData.risk_factors.filter(Boolean),
      diagnosis: formData.diagnosis.filter(Boolean),
      prevention: formData.prevention.filter(Boolean),
      complications: formData.complications.filter(Boolean),
      stages: formData.stages.filter(Boolean),
      when_to_see_doctor: formData.when_to_see_doctor.filter(Boolean),
      emergency_signs: formData.emergency_signs.filter(Boolean),
      related_diseases: formData.related_diseases.filter(Boolean),
      affected_body_parts: formData.affected_body_parts.filter(Boolean),
    }

    // Filter out empty arrays within treatments object
    const filteredTreatments = {};
    Object.keys(payload.treatments).forEach(key => {
      if (Array.isArray(payload.treatments[key]) && payload.treatments[key].filter(Boolean).length > 0) {
        filteredTreatments[key] = payload.treatments[key].filter(Boolean);
      }
    });
    if (Object.keys(filteredTreatments).length > 0) {
      payload.treatments = filteredTreatments;
    } else {
      delete payload.treatments;
    }

    // Filter out empty strings within statistics object
    const filteredStatistics = {};
    Object.keys(payload.statistics).forEach(key => {
      if (payload.statistics[key]) {
        filteredStatistics[key] = payload.statistics[key];
      }
    });
    if (Object.keys(filteredStatistics).length > 0) {
      payload.statistics = filteredStatistics;
    } else {
      delete payload.statistics;
    }

    // Filter out empty references
    payload.references = payload.references.filter(ref => ref.source || ref.url);
    if (payload.references.length === 0) {
      delete payload.references;
    }
    
    // For date and type fields
    payload.date = new Date().toISOString().split('T')[0]; // Add current date
    payload.type = 'Manual Entry'; // Or a different default type


    const res = await fetch('/api/diseases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newRecord = await res.json() // Assuming API returns the saved record with _id
      setRecords(prev => [newRecord, ...prev])
      setIsFormOpen(false)
      setFormData(initialFormData) // Reset form to initial empty state
    } else {
      // Handle error
      console.error("Failed to save record")
      alert("Failed to save record. Please check the console for details.");
    }
  }

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

  const renderArrayInput = (fieldName, placeholder, currentItem, setCurrentItem, arrayData) => (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{placeholder.split(' (')[0]}:</Label>
      <div className="flex items-center space-x-2">
        <Input
          id={fieldName}
          name={fieldName}
          placeholder={placeholder}
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
          Add
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
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
      <EnhancedHeader />
      <div className="container mx-auto px-4 py-8 space-y-8"> {/* Added space-y-8 for vertical spacing */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-main md:text-3xl">My Health Records</h1> {/* Adjusted heading size and color */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white shadow-soft hover:bg-primary/90"> {/* Styled button */}
                <PlusCircle className="mr-2 h-5 w-5" /> {/* Increased icon size slightly */}
                Add New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl overflow-y-auto max-h-[90vh]"> {/* Increased max-width and added scroll for content */}
              <DialogHeader>
                <DialogTitle>Add New Health Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4 p-4"> {/* Added padding to form */}
                <div className="space-y-2">
                  <Label htmlFor="disease_name">Disease Name:</Label>
                  <Input name="disease_name" placeholder="Disease Name" value={formData.disease_name} onChange={handleFormChange} required className="rounded-md shadow-sm" />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAutoFillWithAI} 
                  disabled={isAutoFilling || !formData.disease_name.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-soft"
                >
                  {isAutoFilling ? 'Auto-filling...' : <><Wand2 className="mr-2 h-4 w-4" /> Auto Fill with AI</>}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview:</Label>
                  <Textarea name="overview" placeholder="Overview" value={formData.overview} onChange={handleFormChange} required className="rounded-md shadow-sm" />
                </div>
                
                {renderArrayInput('causes', 'Causes', newCause, setNewCause, formData.causes)}
                {renderArrayInput('symptoms', 'Symptoms', newSymptom, setNewSymptom, formData.symptoms)}
                {renderArrayInput('risk_factors', 'Risk Factors', newRiskFactor, setNewRiskFactor, formData.risk_factors)}
                {renderArrayInput('diagnosis', 'Diagnosis', newDiagnosis, setNewDiagnosis, formData.diagnosis)}

                <h3 className="font-semibold text-lg mt-4">Treatments</h3>
                {renderArrayInput('lifestyle_treatments', 'Lifestyle Treatments', newLifestyleTreatment, setNewLifestyleTreatment, formData.lifestyle_treatments)}
                {renderArrayInput('medication_treatments', 'Medications', newMedicationTreatment, setNewMedicationTreatment, formData.medication_treatments)}
                {renderArrayInput('therapy_treatments', 'Therapies', newTherapyTreatment, setNewTherapyTreatment, formData.therapy_treatments)}
                {renderArrayInput('surgery_treatments', 'Surgery', newSurgeryTreatment, setNewSurgeryTreatment, formData.surgery_treatments)}

                {renderArrayInput('prevention', 'Prevention', newPrevention, setNewPrevention, formData.prevention)}
                {renderArrayInput('complications', 'Complications', newComplication, setNewComplication, formData.complications)}
                {renderArrayInput('stages', 'Stages', newStage, setNewStage, formData.stages)}
                
                <div className="space-y-2">
                  <Label htmlFor="prognosis">Prognosis:</Label>
                  <Textarea name="prognosis" placeholder="Prognosis" value={formData.prognosis} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>

                {renderArrayInput('when_to_see_doctor', 'When to See Doctor', newWhenToSeeDoctor, setNewWhenToSeeDoctor, formData.when_to_see_doctor)}
                {renderArrayInput('emergency_signs', 'Emergency Signs', newEmergencySign, setNewEmergencySign, formData.emergency_signs)}
                {renderArrayInput('related_diseases', 'Related Diseases', newRelatedDisease, setNewRelatedDisease, formData.related_diseases)}
                {renderArrayInput('affected_body_parts', 'Affected Body Parts', newAffectedBodyPart, setNewAffectedBodyPart, formData.affected_body_parts)}

                <h3 className="font-semibold text-lg mt-4">Statistics</h3>
                <div className="space-y-2">
                  <Label htmlFor="global_cases_statistics">Global Cases:</Label>
                  <Input name="global_cases_statistics" placeholder="Global Cases" value={formData.global_cases_statistics} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_deaths_statistics">Annual Deaths:</Label>
                  <Input name="annual_deaths_statistics" placeholder="Annual Deaths" value={formData.annual_deaths_statistics} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prevalence_rate_statistics">Prevalence Rate:</Label>
                  <Input name="prevalence_rate_statistics" placeholder="Prevalence Rate" value={formData.prevalence_rate_statistics} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>

                <h3 className="font-semibold text-lg mt-4">Reference</h3>
                <div className="space-y-2">
                  <Label htmlFor="reference_source">Reference Source:</Label>
                  <Input name="reference_source" placeholder="Reference Source" value={formData.reference_source} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference_url">Reference URL:</Label>
                  <Input name="reference_url" placeholder="Reference URL" value={formData.reference_url} onChange={handleFormChange} className="rounded-md shadow-sm" />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-soft">Save Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {records.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map(record => (
              <Card key={record._id} className="rounded-lg shadow-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-main">{record.disease_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {record.overview && <p className="mb-2"><strong>Overview:</strong> {record.overview}</p>}
                  {record.causes && record.causes.length > 0 && <p className="text-sm text-gray-600 mt-2"><strong>Causes:</strong> {record.causes.join(', ')}</p>}
                  {record.symptoms && record.symptoms.length > 0 && <p className="text-sm text-gray-600"><strong>Symptoms:</strong> {record.symptoms.join(', ')}</p>}
                  {record.risk_factors && record.risk_factors.length > 0 && <p className="text-sm text-gray-600"><strong>Risk Factors:</strong> {record.risk_factors.join(', ')}</p>}
                  {record.diagnosis && record.diagnosis.length > 0 && <p className="text-sm text-gray-600"><strong>Diagnosis:</strong> {record.diagnosis.join(', ')}</p>}

                  {record.treatments && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-main">Treatments:</h4>
                      {record.treatments.lifestyle && record.treatments.lifestyle.length > 0 && <p className="text-sm text-gray-600"><strong>Lifestyle:</strong> {record.treatments.lifestyle.join(', ')}</p>}
                      {record.treatments.medications && record.treatments.medications.length > 0 && <p className="text-sm text-gray-600"><strong>Medications:</strong> {record.treatments.medications.join(', ')}</p>}
                      {record.treatments.therapies && record.treatments.therapies.length > 0 && <p className="text-sm text-gray-600"><strong>Therapies:</strong> {record.treatments.therapies.join(', ')}</p>}
                      {record.treatments.surgery && record.treatments.surgery.length > 0 && <p className="text-sm text-gray-600"><strong>Surgery:</strong> {record.treatments.surgery.join(', ')}</p>}
                    </div>
                  )}

                  {record.prevention && record.prevention.length > 0 && <p className="text-sm text-gray-600 mt-2"><strong>Prevention:</strong> {record.prevention.join(', ')}</p>}
                  {record.complications && record.complications.length > 0 && <p className="text-sm text-gray-600"><strong>Complications:</strong> {record.complications.join(', ')}</p>}
                  {record.stages && record.stages.length > 0 && <p className="text-sm text-gray-600"><strong>Stages:</strong> {record.stages.join(', ')}</p>}
                  {record.prognosis && <p className="text-sm text-gray-600"><strong>Prognosis:</strong> {record.prognosis}</p>}
                  {record.when_to_see_doctor && record.when_to_see_doctor.length > 0 && <p className="text-sm text-gray-600"><strong>When to See Doctor:</strong> {record.when_to_see_doctor.join(', ')}</p>}
                  {record.emergency_signs && record.emergency_signs.length > 0 && <p className="text-sm text-gray-600"><strong>Emergency Signs:</strong> {record.emergency_signs.join(', ')}</p>}
                  {record.related_diseases && record.related_diseases.length > 0 && <p className="text-sm text-gray-600"><strong>Related Diseases:</strong> {record.related_diseases.join(', ')}</p>}
                  {record.affected_body_parts && record.affected_body_parts.length > 0 && <p className="text-sm text-gray-600"><strong>Affected Body Parts:</strong> {record.affected_body_parts.join(', ')}</p>}

                  {record.statistics && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-main">Statistics:</h4>
                      {record.statistics.global_cases && <p className="text-sm text-gray-600"><strong>Global Cases:</strong> {record.statistics.global_cases}</p>}
                      {record.statistics.annual_deaths && <p className="text-sm text-gray-600"><strong>Annual Deaths:</strong> {record.statistics.annual_deaths}</p>}
                      {record.statistics.prevalence_rate && <p className="text-sm text-gray-600"><strong>Prevalence Rate:</strong> {record.statistics.prevalence_rate}</p>}
                    </div>
                  )}

                  {record.references && record.references.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-main">References:</h4>
                      {record.references.map((ref, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {ref.source && <strong>{ref.source}: </strong>}
                          {ref.url && <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{ref.url}</a>}
                        </p>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No records found. Add your first one!</p>
        )}
      </div>
    </main>
  )
}