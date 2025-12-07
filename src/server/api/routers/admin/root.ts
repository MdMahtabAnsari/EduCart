import { router } from "@/server/api/trpc";
import { languageRouter } from "@/server/api/routers/admin/language";

export const adminRouter = router({
    language: languageRouter,
});