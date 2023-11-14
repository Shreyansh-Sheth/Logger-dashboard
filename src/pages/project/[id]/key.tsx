import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Delete } from "lucide-react";
import SidebarLayout from "@/components/Dashboard";
import { useRouter } from "next/router";
import { TrashIcon } from "@radix-ui/react-icons";

export default function ProjectDetails() {
  return (
    <SidebarLayout title={"Keys Management"}>
      <KeysPanel />
    </SidebarLayout>
  );
}

const KeysPanel = () => {
  const addKeyMutation = api.key.create.useMutation();
  const { query } = useRouter();

  const allKeys = api.key.getList.useQuery(
    { projectId: query.id?.toString() ?? "" },
    {
      enabled: !!query.id,
    },
  );

  const deleteMutation = api.key.revoke.useMutation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Button
          disabled={addKeyMutation.isLoading}
          onClick={() =>
            addKeyMutation.mutate(
              { projectId: query.id?.toString() ?? "" },
              {
                onSuccess(data, variables, context) {
                  void allKeys.refetch();
                },
              },
            )
          }
        >
          Add New Key
        </Button>
      </div>
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allKeys.data?.map((e) => (
              <TableRow key={e._id.toString()}>
                <TableCell>{e.key.slice(0, 7) + "*".repeat(7)}</TableCell>
                <TableCell>{e.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => {
                      // Copy to clipboard
                      if (navigator.clipboard)
                        void navigator.clipboard.writeText(e.key);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size={"icon"}
                    className="text-red-500"
                    variant={"outline"}
                    onClick={() => {
                      // Copy to clipboard
                      deleteMutation.mutate(
                        { id: e._id.toString() },
                        {
                          onSuccess(data, variables, context) {
                            void allKeys.refetch();
                          },
                        },
                      );
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
