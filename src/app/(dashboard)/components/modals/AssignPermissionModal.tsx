import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AssignPermissionModalProps {
  selectedRow: any;
  onSave: (permissions: string[]) => Promise<void>;
  onCancel: () => void;
}

export function AssignPermissionModal({
  selectedRow,
  onSave,
  onCancel,
}: AssignPermissionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Permissions</DialogTitle>
          <DialogDescription>
            Assign permissions for {selectedRow?.name || "--"}.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='permissions' className='text-right'>
              Permissions
            </Label>
            <Input
              id='permissions'
              placeholder='e.g., admin, editor'
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave([
                (document.getElementById("permissions") as HTMLInputElement)
                  ?.value,
              ])
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
