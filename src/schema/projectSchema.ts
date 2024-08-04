import { projectCategories } from "@/constants";
import { z } from "zod";

const projectCategoriesEnum = z.enum([
    'backend',
    'frontend',
    'fullstack',
    'mobile',
    'data-science',
    'devops',
    'game-dev',
    'security',
    'embedded',
    'blockchain',
    'machine-learning',
    'artificial-intelligence',
    'cloud-computing',
    'ui-ux',
    'iot',
    'ar-vr',
    'database',
    'networking',
    'automation',
    'quantum-computing',
    'robotics',
    'bioinformatics',
    'fintech'
  ]);
const ProjectSchema = z.object({
    // category:projectCategoriesEnum,
    title: z.string(),
    description: z.string(),
    // banner: z.string().optional(),
    // images: z.array(z.string()).optional(),
    openForCollab: z.boolean().default(false),
    // start: z.string(),
    // end: z.string().optional(),
    currently_working: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
    live_link: z.string().optional(),
    // github: z.array(
    //   z.object({
    //     title: z.string(),
    //     link: z.string(),
    //   })
    // ),
    demo: z.string().optional(),
    // contributors: z.array(
    //   z.object({
    //     user_id: z.string(),
    //     role: z.enum(['lead', 'contributor']),
    //   })
    // ),
});
  
  export { ProjectSchema };