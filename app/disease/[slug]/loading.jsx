export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
        <p className="text-gray-600">তথ্য লোড হচ্ছে...</p>
      </div>
    </div>
  )
}
