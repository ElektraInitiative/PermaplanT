import { createNextcloudAPI } from "@/config/axios";

export const sendMessage = (chatToken: string, message: string) => {
  let http = createNextcloudAPI()
  http.defaults.headers['OCS-APIRequest'] = true
  http.defaults.headers['Accept'] = 'application/json'
  http.defaults.headers['format'] = 'json'

  http.post("/ocs/v2.php/apps/spreed/api/v1/chat/" + chatToken, {
    message
  })
}

export const getConversations = async () => {
  let http = createNextcloudAPI()
  http.defaults.headers['OCS-APIRequest'] = true

  const data = await http.get("/ocs/v2.php/apps/spreed/api/v4/room")
  console.log(data)
}
