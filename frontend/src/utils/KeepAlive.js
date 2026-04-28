export function startKeepAlive() {
  const ping = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MIRA_API_URL}/health`)
    } catch (e) {}
  }
  
  ping() // ping immediately on load
  setInterval(ping, 10 * 60 * 1000) // then every 10 minutes
}