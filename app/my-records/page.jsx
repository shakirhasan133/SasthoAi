"use client"
import { useState, useEffect } from "react"
import EnhancedHeader from "../../components/EnhancedHeader"
import useAuth from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"
import { PlusCircle } from "lucide-react"
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

export default function MyRecordsPage() {
  const { user, loading } = useAuth()
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', symptoms: '', treatments: '' })

  useEffect(() => {
    if (user) {
      fetch('/api/diseases', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRecords(data)
          }
          setIsLoading(false)
        })
    } else if (!loading) {
      setIsLoading(false)
    }
  }, [user, loading])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      symptoms: formData.symptoms.split(',').map(s => s.trim()),
      treatments: formData.treatments.split(',').map(t => t.trim()),
    }
    const res = await fetch('/api/diseases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newRecord = await res.json()
      setRecords(prev => [newRecord, ...prev])
      setIsFormOpen(false)
      setFormData({ name: '', description: '', symptoms: '', treatments: '' })
    } else {
      // Handle error
      console.error("Failed to save record")
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
      <EnhancedHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Health Records</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Health Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input name="name" placeholder="Disease Name" value={formData.name} onChange={handleFormChange} required />
                <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleFormChange} required />
                <Input name="symptoms" placeholder="Symptoms (comma-separated)" value={formData.symptoms} onChange={handleFormChange} required />
                <Input name="treatments" placeholder="Treatments (comma-separated)" value={formData.treatments} onChange={handleFormChange} required />
                <Button type="submit">Save Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {records.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map(record => (
              <Card key={record._id}>
                <CardHeader>
                  <CardTitle>{record.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{record.description}</p>
                  <h4 className="font-semibold">Symptoms:</h4>
                  <p className="text-sm text-gray-600">{record.symptoms.join(', ')}</p>
                  <h4 className="font-semibold mt-2">Treatments:</h4>
                  <p className="text-sm text-gray-600">{record.treatments.join(', ')}</p>
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
