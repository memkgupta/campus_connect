import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useEventDashboard } from "@/context/dashboard/useContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Link = {
  title: string;
  description: string;
  url: string;
};

type Assignment = {
  _id: string;
  title: string;
  description: string;
  leadOnly: boolean;
  submissionDeadline: string;
  links: Link[];
  form: string;
  createdAt: string;
};

type AssignmentListProps = {
  assignments: Assignment[];
};

export default function AssignmentList() {
    const {data:event} = useEventDashboard()!
    const assignments:Assignment[] = event.assignments
    const pathName = usePathname()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assignments.map((assignment) => (
        <Card key={assignment._id}>
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {assignment.description}
              </p>
            </div>
            {assignment.leadOnly && (
              <Badge variant="destructive" className="h-fit">
                Lead Only
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Submission Deadline:</strong>{" "}
              {format(new Date(assignment.submissionDeadline), "PPP p")}
            </div>
            <div>
              <strong>Form ID:</strong> {assignment.form}
            </div>

            {assignment.links.length > 0 && (
              <div>
                <strong>Links:</strong>
                <ul className="list-disc ml-4 space-y-1">
                  {assignment.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.title}
                      </a>{" "}
                      - <span className="text-muted-foreground">{link.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
         <div className="flex justify-end">
             <Link href={`${pathName}/assignments/${assignment._id}`} className="border border-white p-2 rounded-md mr-2 mb-2">View</Link>
         </div>
        </Card>
      ))}
    </div>
  );
}
