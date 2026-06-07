import { cookies } from "next/headers";


export async function CheckAccess(){
    const token = (await cookies()).get("access-token-producer");
    try {
        let res = await fetch(process.env.BACKEND_URL + "/api/v1/producer/checker", {
          method: "POST",
          cache: "no-store",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${token?.value}`
          }
        });
        if(res.status == 403){
            return {
                message: "Invalid Token",
                status:   false
            }
        }
        if (res.status !== 401 && res.status !== 403) {
            let data = await res.json();
            if(data.message === "Authenticated"){
                return {
                    message: "Authenticated",
                    status:   true
                }
            }
        }
    
        return {
            message: "Invalid Token",
            status:   false
        }
      } catch (e:any) {
        return {
          error: "UNAUTHORIZED"
        };
      }


}