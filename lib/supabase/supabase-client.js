const { createClient } = require("@supabase/supabase-js");


export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_CLIENT_KEY)



// Helper Function to get User Session
export const userSession = async ()=>{
    const {data : {session}, error} = await supabase.auth.getSession()
    if(error) throw error
    else return session
}

// Helper Function to getUser 
export const user = async ()=>{
    const {data : {user}, error} = await supabase.auth.getUser()
    if(error) throw error
    else return user
}

// Helper function to signOut
export const signOut = async ()=>{
    const {error} = await supabase.auth.signOut()
    if(error) throw error
}