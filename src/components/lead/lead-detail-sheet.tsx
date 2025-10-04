// components/LeadDetailSheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Building, Phone, MessageSquare } from "lucide-react";
import { Lead, useUpdateLead } from "@/hooks/useLeads";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadDetailSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Contacted: "bg-blue-100 text-blue-800 border-blue-300",
  Responded: "bg-green-100 text-green-800 border-green-300",
  Converted: "bg-purple-100 text-purple-800 border-purple-300",
};

export default function LeadDetailSheet({
  lead,
  isOpen,
  onClose,
}: LeadDetailSheetProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const updateLeadMutation = useUpdateLead();

  if (!lead) return null;

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === lead.status) return;

    try {
      await updateLeadMutation.mutateAsync({
        id: lead.id,
        status: newStatus as Lead["status"],
      });

      // Add interaction to history
      const interactionHistory = lead.interactionHistory
        ? JSON.parse(lead.interactionHistory)
        : [];

      interactionHistory.push({
        date: new Date().toISOString(),
        type: "Status Update",
        description: `Status changed from ${lead.status} to ${newStatus}`,
      });

      await updateLeadMutation.mutateAsync({
        id: lead.id,
        interactionHistory,
      });

      setNewStatus("");
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const handleContact = async () => {
    try {
      const interactionHistory = lead.interactionHistory
        ? JSON.parse(lead.interactionHistory)
        : [];

      interactionHistory.push({
        date: new Date().toISOString(),
        type: "Contact Attempt",
        description: "Lead contacted via email",
      });

      await updateLeadMutation.mutateAsync({
        id: lead.id,
        status: "Contacted" as Lead["status"],
        interactionHistory,
      });
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const interactionHistory = lead.interactionHistory
    ? JSON.parse(lead.interactionHistory)
    : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[500px] sm:w-[600px] overflow-y-auto"
      >
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">{lead.name}</SheetTitle>
            <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                </div>
              )}

              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{lead.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Last Contact</p>
                  <p className="font-medium">
                    {lead.lastContactDate
                      ? new Date(lead.lastContactDate).toLocaleDateString()
                      : "Never contacted"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Associated Campaign</p>
              <p className="font-medium text-lg">{lead.campaignName}</p>
            </CardContent>
          </Card>

          {/* Interaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Interaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interactionHistory.length > 0 ? (
                <div className="space-y-3">
                  {interactionHistory
                    .slice(0, 5)
                    .map((interaction: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-200 pl-4 pb-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {interaction.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(interaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {interaction.description}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No interactions recorded yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleContact}
                  disabled={updateLeadMutation.isPending}
                  className="flex-1"
                >
                  {updateLeadMutation.isPending
                    ? "Contacting..."
                    : "Contact Lead"}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <div className="flex gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Responded">Responded</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={handleStatusUpdate}
                    disabled={
                      !newStatus ||
                      newStatus === lead.status ||
                      updateLeadMutation.isPending
                    }
                  >
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span>{new Date(lead.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lead ID:</span>
                <span>#{lead.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
