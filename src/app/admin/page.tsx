"use client"
import { AdminDashboard } from "@/components"; 
import { useRouter } from "next/navigation"

const AdminPage = () => {
  const { push } = useRouter();
  return (
    <div className="flex">AdminPage 
      <AdminDashboard/> 
      </div>
  )
}

export default AdminPage

