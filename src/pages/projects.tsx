import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { findDOMNode } from "react-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Circle } from "lucide-react";
export default function Project() {
  const projects = api.project.getList.useQuery();
  return (
    <div className="m-10">
      <div className="flex justify-end">
        <AddProject />
      </div>
      <div className="flex flex-wrap gap-2">
        {projects.data?.map((project) => {
          return (
            <ProjectCard
              id={project.projectId._id}
              key={project._id.toString()}
              name={project.projectId.name}
            />
          );
        })}
      </div>
    </div>
  );
}

const ProjectCard = ({ name, id }: { name: string; id: string }) => {
  return (
    <Card className="relative w-96">
      <Circle className="absolute right-0 m-3 h-4 w-4 animate-pulse fill-green-500 stroke-transparent text-xs" />
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardFooter>
        <Button variant={"secondary"} size={"sm"}>
          <Link href={`/project/${id}`}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const formSchema = z.object({
  name: z.string().trim().min(1),
});

const AddProject = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const addPorjetcMutation = api.project.create.useMutation();

  const queryContext = api.useUtils();
  function onSubmit(values: z.infer<typeof formSchema>) {
    addPorjetcMutation.mutate(values, {
      onSuccess: () => {
        queryContext.project.getList
          .refetch()
          .catch(console.error)
          .finally(() => {
            setIsOpen(false);
            form.reset();
          });
      },
    });
  }
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want To Create New Project ?</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        You Can Only Create 3 Project. Want To Create More
                        Projects? <Link href={"/contact"}>Contact Us</Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={addPorjetcMutation.isLoading} type="submit">
                  {addPorjetcMutation.isLoading && (
                    <Loader2 className="animate-spin" size={20} />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
