import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/image";
import { format } from "date-fns";
import { AtSign, Calendar } from "lucide-react";

interface FormSubmissionProps {
  data: {
    submissionData: Record<string, string>;
    submittedAt: string;
    userDetails: {
      profile: string;
      name: string;
      email: string;
      username: string;
    };
    form: {
      formName: string;
      fields: Array<{
        _id: number;
        fieldLabel: string;
        fieldType: string;
      }>;
    };
    event: {
      name: string;
      description: string;
      banner: string;
    };
  };
}

export function FormSubmission({ data }: FormSubmissionProps) {
  return (
    <Card className="bg-slate-950 border-yellow-500">
      {/* Event Banner */}
      <div className="relative h-48 w-full">
        <CustomImage
          src={data.event.banner} 
          alt={data.event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Event Details */}
      <CardHeader className="space-y-4">
        <CardTitle className="text-3xl font-bold text-yellow-400">
          {data.event.name}
        </CardTitle>
        <p className="text-yellow-300/80">{data.event.description}</p>
        <div className="flex items-center gap-2 text-yellow-500">
          <Calendar className="w-4 h-4" />
          <time className="text-sm">
            Submitted on {format(new Date(data.submittedAt), "PPP 'at' p")}
          </time>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* User Profile */}
        <div className="p-6 rounded-lg bg-slate-900/50 border border-yellow-500/20">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Applicant Details</h3>
          <div className="flex items-center gap-4">
            <CustomImage
              src={data.userDetails.profile} 
              alt={data.userDetails.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500"
            />
            <div className="space-y-1">
              <h4 className="font-semibold text-yellow-400">{data.userDetails.name}</h4>
              <p className="text-sm text-yellow-500">{data.userDetails.email}</p>
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <AtSign className="w-4 h-4" />
                {data.userDetails.username}
              </div>
            </div>
          </div>
        </div>

        {/* Form Responses */}
        <div className="p-6 rounded-lg bg-slate-900/50 border border-yellow-500/20">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">
            {data.form.formName} Responses
          </h3>
          <div className="space-y-4">
            {data.form.fields.map((field) => (
              <div key={field._id} className="space-y-2">
                <label className="text-sm text-yellow-500">{field.fieldLabel}</label>
                <div className="p-3 rounded-md bg-slate-900 border border-yellow-500/20 text-yellow-400">
                  {field.fieldType === 'textarea' ? (
                    <div className="whitespace-pre-wrap">
                      {data.submissionData[field._id]}
                    </div>
                  ) : (
                    data.submissionData[field._id]
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}