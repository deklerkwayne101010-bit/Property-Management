'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  LogIn, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Camera,
  BarChart3,
  MessageSquare,
  Settings,
  DollarSign,
  Zap,
  Award,
  Globe,
  Heart
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (session?.user) {
      // Redirect based on role
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/client/dashboard')
      }
    }
  }, [session, status, router])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, show alert
    alert('Thank you for your interest! We will contact you within 24 hours to set up your Property Buddy AI account.')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Property Buddy AI</h1>
              <span className="ml-2 text-sm text-gray-500">South Africa</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
              >
                <LogIn className="h-4 w-4" />
                Client Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                The Complete
                <span className="block text-blue-600">Holiday Rental</span>
                <span className="block">Management Platform</span>
                <span className="text-2xl text-gray-600 block mt-4">for South Africa</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Stop juggling multiple systems! Property Buddy AI is the all-in-one platform 
                that manages your properties, bookings, maintenance, and guest communications 
                in one beautiful dashboard. Built specifically for South African property owners.
              </p>
              
              {/* Key Benefits */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Track bookings and revenue in real-time</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Manage maintenance and cleaning schedules</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Communicate with property owners instantly</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">All prices in South African Rand (R)</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  See How It Works
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Properties Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Property Managers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard Preview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Mock Dashboard */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="text-xl font-bold text-blue-600">R45,800</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Occupancy Rate</span>
                      <span className="text-xl font-bold text-green-600">87%</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Bookings</span>
                      <span className="text-xl font-bold text-purple-600">12</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Maintenance</span>
                      <span className="text-xl font-bold text-orange-600">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need to Manage Your Holiday Rentals
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Property Buddy AI combines all the tools you need to run a successful 
              holiday rental business in South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Management</h3>
              <p className="text-gray-600 mb-4">
                Add unlimited properties with detailed information, high-quality photos, 
                and amenity listings. Perfect for managing multiple properties across South Africa.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Property photo galleries</li>
                <li>• Detailed property descriptions</li>
                <li>• Amenity and feature tracking</li>
                <li>• Multi-property portfolio view</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Booking System</h3>
              <p className="text-gray-600 mb-4">
                Track all your bookings in real-time with calendar views, automatic 
                confirmations, and detailed guest information management.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time booking calendar</li>
                <li>• Guest information management</li>
                <li>• Automatic booking confirmations</li>
                <li>• Revenue tracking and reporting</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Maintenance & Cleaning</h3>
              <p className="text-gray-600 mb-4">
                Schedule and track all maintenance and cleaning activities with 
                photo documentation and detailed reporting.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Automated scheduling</li>
                <li>• Photo documentation</li>
                <li>• Inspection reports</li>
                <li>• Service provider coordination</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Hub</h3>
              <p className="text-gray-600 mb-4">
                Built-in messaging system for seamless communication between 
                property managers and property owners.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Direct messaging system</li>
                <li>• Property-specific conversations</li>
                <li>• File and photo sharing</li>
                <li>• Message history and tracking</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reporting</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive analytics and reporting tools to track performance, 
                revenue, and occupancy rates across all properties.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Revenue analytics</li>
                <li>• Occupancy rate tracking</li>
                <li>• Performance comparisons</li>
                <li>• Custom report generation</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Camera className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Photo Management</h3>
              <p className="text-gray-600 mb-4">
                Upload and organize property photos with monthly updates, 
                inspection photos, and before/after maintenance documentation.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Monthly property updates</li>
                <li>• Inspection photo galleries</li>
                <li>• Before/after documentation</li>
                <li>• Cloud storage and backup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* South African Market Focus */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 mr-3" />
              <h2 className="text-4xl font-bold">Built for South Africa</h2>
            </div>
            <p className="text-xl mb-12 max-w-4xl mx-auto opacity-90">
              Property Buddy AI understands the unique needs of South African property owners. 
              From Cape Town to Durban, from the Kruger National Park to the Garden Route - 
              we've got you covered.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ZAR Currency</h3>
                <p className="opacity-90">All pricing and revenue tracking in South African Rand for easy financial management</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Support</h3>
                <p className="opacity-90">South African customer support team understands your market and timezone</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="opacity-90">Built by South Africans, for South Africans, with deep understanding of local regulations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Join hundreds of satisfied property managers across South Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Property Buddy AI has transformed how I manage my 15 holiday properties in Cape Town. 
                The ZAR currency support and local understanding make all the difference."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-600">Property Manager, Cape Town</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Finally, a platform that understands the South African market. The maintenance 
                scheduling and owner communication features are exactly what we needed."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Mike K.</div>
                  <div className="text-sm text-gray-600">Property Owner, Durban</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The reporting and analytics help me make better business decisions. 
                Tracking revenue in Rands with proper local formatting is a huge plus."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Lisa J.</div>
                  <div className="text-sm text-gray-600">Portfolio Manager, Johannesburg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/CTAs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Simple Pricing for Property Managers
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the plan that works for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R299</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Up to 5 properties</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Property management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Booking system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Start Free Trial
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-blue-600 p-8 rounded-xl border-2 border-blue-600 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8 text-white">
                <h3 className="text-2xl font-bold">Professional</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R599</span>
                  <span className="opacity-90">/month</span>
                </div>
                <p className="opacity-90 mt-2">Unlimited properties</p>
              </div>
              
              <ul className="space-y-3 mb-8 text-white">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Maintenance management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Custom integrations</span>
                </li>
              </ul>
              
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-white hover:bg-gray-100 text-blue-600 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Property Management?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join hundreds of South African property managers who trust Property Buddy AI 
                to run their holiday rental business.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">+27 11 123 4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">hello@propertybuddy.co.za</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Cape Town, South Africa</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Monday - Friday: 8:00 AM - 6:00 PM SAST</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Your Free Trial</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+27 82 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How many properties do you manage?
                  </label>
                  <select
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an option</option>
                    <option value="1-5">1-5 properties</option>
                    <option value="6-15">6-15 properties</option>
                    <option value="16-50">16-50 properties</option>
                    <option value="50+">50+ properties</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  Get Started Now
                </button>
                
                <p className="text-sm text-gray-600 text-center">
                  Free 14-day trial • No credit card required • Cancel anytime
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <h3 className="ml-2 text-2xl font-bold">Property Buddy AI</h3>
              </div>
              <p className="text-gray-400 mb-4">
                The complete holiday rental management platform for South Africa. 
                Built by South Africans, for South Africans.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>hello@propertybuddy.co.za</li>
                <li>+27 11 123 4567</li>
                <li>Cape Town, South Africa</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Property Buddy AI. All rights reserved. Proudly South African.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
