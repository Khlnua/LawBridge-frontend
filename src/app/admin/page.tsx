"use client"
import { AdminDashboard } from "@/components"; 
import { useRouter } from "next/navigation"

const AdminPage = () => {
  const { push } = useRouter();
  return (
    <div className="flex">AdminPage 
      <button onClick={() => push("/admin/lawyer-requests")}>Reqeust to join</button>
      <AdminDashboard/> 
      </div>
  )
}

export default AdminPage

