'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, 
  LogIn, 
  AlertCircle, 
  Shield, 
  Mail, 
  Phone,
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else {
        // Get session to determine role
        const session = await getSession()
        if (session?.user?.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/client/dashboard')
        }
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">Property Buddy AI</h1>
                <span className="ml-2 text-sm text-gray-500">South Africa</span>
              </Link>
            </div>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <LogIn className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Sign in to your Property Buddy AI dashboard
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </div>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })}
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Contact us to get started
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Benefits & Features */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Property Owners Choose Us
                </h3>
                <p className="text-lg text-gray-600">
                  Join hundreds of South African property managers who trust Property Buddy AI 
                  to run their holiday rental business efficiently.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Property Management</h4>
                    <p className="text-gray-600">Manage unlimited properties with detailed analytics and reporting</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Booking System</h4>
                    <p className="text-gray-600">Track bookings, occupancy rates, and revenue in real-time</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Maintenance Management</h4>
                    <p className="text-gray-600">Schedule cleanings and maintenance with photo documentation</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Local South African Support</h4>
                    <p className="text-gray-600">ZAR currency, local expertise, and SAST timezone support</p>
                  </div>
                </div>
              </div>

              {/* Demo Credentials Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Demo Account Access
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="font-medium text-gray-900">Admin Demo</div>
                    <div className="text-gray-600">Email: admin@propertybuddy.com</div>
                    <div className="text-gray-600">Password: admin123</div>
                    <div className="text-xs text-blue-600 mt-1">Access full admin features</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="font-medium text-gray-900">Property Owner Demo</div>
                    <div className="text-gray-600">Email: client@propertybuddy.com</div>
                    <div className="text-gray-600">Password: client123</div>
                    <div className="text-xs text-green-600 mt-1">View client dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <section id="contact-info" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              New to Property Buddy AI?
            </h3>
            <p className="text-lg text-gray-600">
              Get started with a free consultation and setup your account today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h4>
              <p className="text-gray-600">+27 11 123 4567</p>
              <p className="text-sm text-gray-500">Monday - Friday, 8AM - 6PM SAST</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h4>
              <p className="text-gray-600">hello@propertybuddy.co.za</p>
              <p className="text-sm text-gray-500">We respond within 2 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h4>
              <p className="text-gray-600">Cape Town, South Africa</p>
              <p className="text-sm text-gray-500">Schedule an appointment</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = '/#contact'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
            >
              Start Free Consultation
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-semibold">Property Buddy AI</span>
              <span className="ml-2 text-sm text-gray-400">South Africa</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 Property Buddy AI. Proudly South African.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}