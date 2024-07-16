import Link from "next/link";
import { FaStethoscope, FaUserMd, FaHospital } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
      <nav className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MediCare</h1>
          <Link href="/auth/login" className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-blue-100 transition">
            Login
          </Link>
        </div>
      </nav>

      <main className="container mx-auto mt-16 px-4">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to MediCare</h2>
          <p className="text-xl mb-8">Advanced Medical Management System</p>
          <Link href="/home/dashboard/" className="bg-white text-blue-500 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition">
            View Dashboard
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FaStethoscope className="text-4xl" />}
            title="Patient Care"
            description="Streamlined patient management and electronic health records."
          />
          <FeatureCard 
            icon={<FaUserMd className="text-4xl" />}
            title="Staff Management"
            description="Efficient scheduling and resource allocation for medical staff."
          />
          <FeatureCard 
            icon={<FaHospital className="text-4xl" />}
            title="Hospital Operations"
            description="Comprehensive tools for managing hospital facilities and resources."
          />
        </div>
      </main>

      <footer className="mt-16 text-center py-4">
        <p>&copy; 2024 MediCare. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white bg-opacity-20 p-6 rounded-lg">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}