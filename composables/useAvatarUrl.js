export const useAvatarUrl=()=>{
// * 取得avatar meta 的資料，有圖像的
// * 該圖像的 url
// * Watch user for any changes - so we alway display inmage of the user

const supabase=useSupabaseClient()
const user=useSupabaseUser()

const getPublicUrl=()=>{
  if(!user.value?.user_metadata?.avatar_url) return null

  const{data}=supabase
  .storage
  .from('avatars')
  .getPublicUrl(user.value?.user_metadata?.avatar_url)

  return data.publicUrl
}


const url=ref(getPublicUrl())

watch(user,()=>url.value=getPublicUrl(),{immediate:true})

return {url}

}