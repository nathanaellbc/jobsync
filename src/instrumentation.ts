export async function register() {
  // The in-process cron scheduler needs a long-running server; serverless
  // functions on Vercel are frozen between requests, so it is skipped there.
  if (process.env.NEXT_RUNTIME === "nodejs" && !process.env.VERCEL) {
    const { syncSchedulerState } = await import("@/lib/scheduler");
    await syncSchedulerState();
  }
}
