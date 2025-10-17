export async function apiGET(path: string){
  const r = await fetch(path)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
export async function apiPOST(path: string, body: any){
  const r = await fetch(path, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
export async function apiPATCH(path: string, body: any){
  const r = await fetch(path, { method: 'PATCH', headers: {'content-type':'application/json'}, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
export async function apiPUT(path: string, body: any){
  const r = await fetch(path, { method: 'PUT', headers: {'content-type':'application/json'}, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
