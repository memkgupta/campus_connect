
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProjectFormData, ProjectResponseData } from "@/types"
import Image from "next/image"

export function ProjectPage({projectData}:{projectData:ProjectResponseData}) {
  return (
    <div className="flex flex-col gap-12 ">
      <section className="bg-muted py-16 md:py-20 lg:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-[1fr_400px] md:gap-12">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
               {projectData.category}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              {projectData.title}
              </h1>
              <p className="text-muted-foreground md:text-xl">
                {projectData.description}
              </p>
              
            </div>
            <div className="flex flex-col items-start gap-6 md:items-end">
              <div className="rounded-lg bg-background p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Project Status</div>
                <div className="text-2xl font-bold">{projectData.status}</div>
              </div>
              <div className="rounded-lg bg-background p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Project Lead</div>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{projectData.lead.name}</div>
                    <div className="text-xs text-muted-foreground">{
                      <Link href={projectData.lead.linkedin||"#"} target="_blank" ><Image src={"/linkedin.png"} width={20} height={20} alt="linkedin"/></Link>
                      }
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-12 ">
        <div className="container">
          <img
            src={projectData.banner}
            width="1200"
            height="600"
            alt="Project Image"
            className="mx-auto rounded-lg"
            style={{ aspectRatio: "1200/600", objectFit: "cover" }}
          />
        </div>
      </section>
      <section>
        
      </section>
      {/* <section>
        <div className="container space-y-6">
          <h2 className="text-2xl font-bold">Objectives</h2>
          <ul className="space-y-4 text-muted-foreground md:text-xl">
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-1 inline-block h-5 w-5" />
              <span>
                Design a visually appealing and user-friendly website that reflects the company's brand identity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-1 inline-block h-5 w-5" />
              <span>Implement a responsive layout that ensures a consistent experience across all devices.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-1 inline-block h-5 w-5" />
              <span>Improve the website's navigation and information architecture to enhance user experience.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-1 inline-block h-5 w-5" />
              <span>Ensure the website is accessible to users with disabilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-1 inline-block h-5 w-5" />
              <span>Optimize the website's performance for faster load times.</span>
            </li>
          </ul>
        </div>
      </section>
      <section>
        <div className="container space-y-6">
          <h2 className="text-2xl font-bold">Features</h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Responsive Design</h3>
              <p className="text-muted-foreground">
                The website is optimized for seamless viewing on various devices, from desktops to mobile phones.
              </p>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Intuitive Navigation</h3>
              <p className="text-muted-foreground">
                The website's navigation structure is designed to be user-friendly and easy to navigate.
              </p>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Accessibility</h3>
              <p className="text-muted-foreground">
                The website adheres to WCAG guidelines, ensuring it is accessible to users with disabilities.
              </p>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Performance Optimization</h3>
              <p className="text-muted-foreground">
                The website is optimized for fast load times and efficient resource utilization.
              </p>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Content Management</h3>
              <p className="text-muted-foreground">
                The website includes a user-friendly content management system, allowing the client to easily update and
                maintain the website.
              </p>
            </div>
            <div className="grid gap-4">
              <h3 className="text-xl font-bold">Analytics and Reporting</h3>
              <p className="text-muted-foreground">
                The website integrates with analytics tools to provide detailed insights and reporting on user behavior
                and engagement.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      <section>
        <div className="container space-y-6">
          <h2 className="text-2xl font-bold">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
           {projectData.technologiesUsed.map((tech:string)=>(
            <Badge variant={"secondary"}>{tech}</Badge>
           ))}
          </div>
        </div>
      </section>
      <section>
        <div className="container space-y-6">
          <h2 className="text-2xl font-bold">Project Status</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Current Phase</div>
              <div className="text-2xl font-bold">{projectData.status}</div>
            </div>
        
          </div>
        </div>
      </section>
      <section>
        <div className="container space-y-6">
          <h2 className="text-2xl font-bold">Team Members</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
           {projectData.contributors.map(contributor=>(
             <div className="flex items-center gap-4">
             <Avatar>
               <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
               <AvatarFallback>CN</AvatarFallback>
             </Avatar>
             <div>
               <div className="font-medium">{contributor.name}</div>
               <div className="text-xs text-muted-foreground">{contributor.role}</div>
               <div className="flex gap-2 items-center">
               {contributor.username &&<Link href={`/user/${contributor.username}`}>{`@${contributor.username}`}</Link>}
               {contributor.linkedin &&<Link href={contributor.linkedin}>
               <Image src={"/linkedin.png"} width={20} height={20} alt="linkedin"/>
               </Link>}
               </div>
             </div>
           </div>
           ))}
          </div>
        </div>
      </section>
      <section>
        <div className="container space-y-6">
          <h2 className="text-2xl font-bold">Project URLs</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Live</div>
              <div className="flex items-center gap-2">
                <Link href={projectData.live_link} className="font-medium" prefetch={false}>
                  Live
                </Link>
                <Button variant="ghost" size="icon">
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          {projectData.documentationLink &&  <div className="rounded-lg bg-background p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Documentation</div>
              <div className="flex items-center gap-2">
                <Link href={projectData.documentationLink} className="font-medium" prefetch={false}>
                  Docs
                </Link>
                <Button variant="ghost" size="icon">
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>}
            {/* <div className="rounded-lg bg-background p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Presentation</div>
              <div className="flex items-center gap-2">
                <Link href="#" className="font-medium" prefetch={false}>
                  slides.example.com
                </Link>
                <Button variant="ghost" size="icon">
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div> */}
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Collaboration</div>
              <div className="flex items-center gap-2">
                <Link href={projectData.github} className="font-medium" prefetch={false}>
                  Github
                </Link>
                <Button variant="ghost" size="icon">
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
    
  )
}



function LinkIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
