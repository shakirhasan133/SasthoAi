"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import EnhancedHeader from '../../components/EnhancedHeader'
import { Command, CommandGroup, CommandItem, CommandList } from "../../components/ui/command";
import { Input } from '../../components/ui/input'
import useAuth from '../../hooks/use-auth'
import { PlusCircle, Brain, MessageSquare, LineChart, FileText, Search } from 'lucide-react' // Import Search icon

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [recentRecords, setRecentRecords] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  // Dummy data for recent records
  const dummyRecentRecords = [
    {
      _id: 'rec1',
      name: 'Fever',
      description: 'High body temperature, mild cough.',
      date: '2024-07-20',
    },
    {
      _id: 'rec2',
      name: 'Headache',
      description: 'Mild headache, stress-induced.',
      date: '2024-07-18',
    },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login') // Redirect to login if not authenticated
    } else if (user) {
      // In a real app, fetch recent records here
      setRecentRecords(dummyRecentRecords) 
    }
  }, [user, loading, router])

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Simple suggestion logic based on dummy data
    if (query.length > 1) {
      const filteredSuggestions = dummyRecentRecords.filter(record =>
        record.name.toLowerCase().includes(query.toLowerCase()) ||
        record.description.toLowerCase().includes(query.toLowerCase())
      ).map(record => record.name); // Suggest just the name for simplicity
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Close suggestions after selection
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-white">
        <EnhancedHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg text-foreground">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-white pb-16"> {/* Added pb-16 for bottom spacing */}
      <EnhancedHeader />
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-2xl"> {/* Max-width for better readability on large screens */}
        <h1 className="text-4xl font-extrabold text-foreground text-center sm:text-left mb-6"> {/* Larger, bolder heading */}
          Welcome, {user.displayName?.split(' ')[0] || 'User'}!
        </h1>

        {/* Search Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-3 mb-4">Search</h2> {/* Separator */}
          <div className="flex space-x-2 relative"> {/* Added relative for absolute positioning of suggestions */}
            <Input
              type="text"
              placeholder="Search your health records..."
              className="flex-grow"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            {suggestions.length > 0 && (
              <Command className="absolute z-10 top-full mt-1 w-[calc(100%-var(--space-x-2))] rounded-md border shadow-md">
 <CommandList className="max-h-[300px] overflow-y-auto"> {/* Increased max height for more suggestions */}
                  <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                      <CommandItem key={index} onSelect={() => handleSuggestionClick(suggestion)}>{suggestion}</CommandItem>
                ))}
 </CommandGroup>
 </CommandList>
              </Command>
            )}
          </div>
        </section>
        {/* Quick Actions */} 
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-3 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> {/* Responsive grid for buttons */}
            <Button 
              className="w-full h-32 py-4 flex flex-col items-center justify-center space-y-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => router.push('/my-records')}
            >
              <PlusCircle className="h-10 w-10 mb-2" />
              <span className="font-bold text-lg">Add Record</span>
            </Button>
            <Button 
              className="w-full h-32 py-4 flex flex-col items-center justify-center space-y-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => router.push('/ai-health')}
            >
              <Brain className="h-10 w-10 mb-2" />
              <span className="font-bold text-lg">AI Health</span>
            </Button>
            <Button 
              className="w-full h-32 py-4 flex flex-col items-center justify-center space-y-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => router.push('/chat')}
            >
              <MessageSquare className="h-10 w-10 mb-2" />
              <span className="font-bold text-lg">Chat</span>
            </Button>
             <Button 
              className="w-full h-32 py-4 flex flex-col items-center justify-center space-y-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => router.push('/my-records')}
            >
              <FileText className="h-10 w-10 mb-2" />
              <span className="font-bold text-lg">My Records</span>
            </Button>
          </div>
        </section>

        {/* Recent Records */} 
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-3 mb-4">Recent Records</h2> {/* Separator */}
          <div className="grid gap-4">
            {recentRecords.length > 0 ? (
              recentRecords.map(record => (
                <Card key={record._id} className="shadow-lg rounded-xl overflow-hidden bg-card text-card-foreground">
                  <CardHeader className="bg-secondary p-4 border-b border-border">
                    <CardTitle className="text-xl font-bold text-foreground">{record.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">{record.date}</p>
                    <p className="text-foreground leading-relaxed mb-4">{record.description}</p>
                    <Button variant="link" className="px-0 text-primary hover:underline font-medium" onClick={() => router.push(`/disease/${record._id}`)}>
                      View Details <span className="ml-1 text-xs">→</span>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg rounded-xl p-6 text-center bg-card text-card-foreground">
                <p className="text-muted-foreground">No recent records found. Start by adding a new health record!</p>
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push('/my-records')}>
                  Add First Record
                </Button>
              </Card>
            )}
          </div>
        </section>

        {/* Health Trends (Placeholder) */} 
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-3 mb-4">Health Trends</h2> {/* Separator */}
          <Card className="shadow-lg rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 bg-card text-card-foreground">
            <LineChart className="h-16 w-16 text-muted-foreground opacity-70" /> {/* Larger, softer icon */}
            <p className="text-muted-foreground text-lg">Visualize your health progress over time.</p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200" onClick={() => router.push('/trends')}>
              Explore Health Trends
            </Button>
          </Card>
        </section>
      </div>
    </main>
  )
}
