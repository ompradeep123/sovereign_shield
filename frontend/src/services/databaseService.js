import { supabase } from "../lib/supabaseClient";

export async function createServiceRequest(request) {
  const { data, error } = await supabase
    .from("service_requests")
    .insert(request)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getCitizenRequests(userId) {
  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("citizen_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function getThreatLogs() {
  const { data, error } = await supabase
    .from("threat_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(50);
    
  if (error) throw error;
  return data;
}

export async function getAuditLogs() {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);
      
    if (error) throw error;
    return data;
}

export async function getBlockchainRecords() {
    const { data, error } = await supabase
      .from("blockchain_records")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);
      
    if (error) throw error;
    return data;
}

export async function verifyCertificateIntegrity(recordId) {
    const { data, error } = await supabase
        .from("blockchain_records")
        .select("*")
        .eq("record_id", recordId)
        .single();
        
    if (error) return { valid: false, message: "Record not found or tampered" };
    return { valid: true, block: data };
}

export async function insertAuditLog(log) {
    await supabase.from("audit_logs").insert(log);
}
