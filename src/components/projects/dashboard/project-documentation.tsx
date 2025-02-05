"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, FileText, ChevronDown, ChevronRight, GripVertical, FolderPlus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type DocumentSection = {
  id: string;
  title: string;
  description: string;
  content?: string;
  lastUpdated: string;
  order: number;
  parentId: string | null;
  subsections: DocumentSection[];
};

const initialSections: DocumentSection[] = [
  {
    id: "1",
    title: "Getting Started",
    description: "Project setup and installation",
    lastUpdated: "2 days ago",
    order: 0,
    parentId: null,
    subsections: [
      {
        id: "1-1",
        title: "Prerequisites",
        description: "Required software and tools",
        lastUpdated: "2 days ago",
        order: 0,
        parentId: "1",
        subsections: []
      },
      {
        id: "1-2",
        title: "Installation Steps",
        description: "Step-by-step installation guide",
        lastUpdated: "2 days ago",
        order: 1,
        parentId: "1",
        subsections: []
      }
    ]
  },
  {
    id: "2",
    title: "Architecture",
    description: "System architecture and design",
    lastUpdated: "1 week ago",
    order: 1,
    parentId: null,
    subsections: [
      {
        id: "2-1",
        title: "Overview",
        description: "High-level architecture overview",
        lastUpdated: "1 week ago",
        order: 0,
        parentId: "2",
        subsections: []
      }
    ]
  }
];

export function ProjectDocumentation() {
  const [sections, setSections] = useState<DocumentSection[]>(initialSections);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["1", "2"]));
  const [editingSection, setEditingSection] = useState<DocumentSection | null>(null);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorder = (list: DocumentSection[], startIndex: number, endIndex: number): DocumentSection[] => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({ ...item, order: index }));
    };

    const sourceParentId = result.source.droppableId;
    const destParentId = result.destination.droppableId;

    if (sourceParentId === destParentId) {
      const newSections = [...sections];
      const targetParent = sourceParentId === 'root' 
        ? newSections
        : newSections.find(s => s.id === sourceParentId)?.subsections;

      if (targetParent) {
        const reordered = reorder(
          targetParent,
          result.source.index,
          result.destination.index
        );
        
        if (sourceParentId === 'root') {
          setSections(reordered);
        } else {
          setSections(newSections.map(section => 
            section.id === sourceParentId 
              ? { ...section, subsections: reordered }
              : section
          ));
        }
      }
    }
  };

  const renderSection = (section: DocumentSection, level: number = 0) => (
    <Draggable key={section.id} draggableId={section.id} index={section.order}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="border-l-2 border-accent ml-4 pl-4 mt-4 first:mt-0"
        >
          <div className="flex items-center group">
            <div {...provided.dragHandleProps} className="mr-2 opacity-0 group-hover:opacity-100">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 hover:bg-transparent"
              onClick={() => toggleSection(section.id)}
            >
              {section.subsections.length > 0 ? (
                expandedSections.has(section.id) ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
            </Button>
            <div className="flex-1" onClick={() => setEditingSection(section)}>
              <div className="font-medium">{section.title}</div>
              <div className="text-sm text-muted-foreground">{section.description}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newSection: DocumentSection = {
                  id: `${section.id}-${section.subsections.length + 1}`,
                  title: "New Subsection",
                  description: "Add description",
                  lastUpdated: new Date().toISOString(),
                  order: section.subsections.length,
                  parentId: section.id,
                  subsections: []
                };
                setSections(sections.map(s => 
                  s.id === section.id 
                    ? { ...s, subsections: [...s.subsections, newSection] }
                    : s
                ));
                setExpandedSections(new Set([...expandedSections, section.id]));
              }}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
          
          {expandedSections.has(section.id) && section.subsections.length > 0 && (
            <Droppable droppableId={section.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {section.subsections.map((subsection) => renderSection(subsection, level + 1))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          const newSection: DocumentSection = {
            id: `${sections.length + 1}`,
            title: "New Section",
            description: "Add description",
            lastUpdated: new Date().toISOString(),
            order: sections.length,
            parentId: null,
            subsections: []
          };
          setSections([...sections, newSection]);
        }}>
          <Plus className="mr-2 h-4 w-4" /> New Section
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Document Structure</CardTitle>
            <CardDescription>
              Organize and manage your documentation sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="root">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {sections.map((section) => renderSection(section))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              {editingSection ? "Edit Section" : "Section Details"}
            </CardTitle>
            <CardDescription>
              {editingSection ? "Modify section content" : "Select a section to edit"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingSection ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={editingSection.description}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      description: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={editingSection.content || ""}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      content: e.target.value
                    })}
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingSection(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setSections(sections.map(section =>
                        section.id === editingSection.id
                          ? editingSection
                          : {
                              ...section,
                              subsections: section.subsections.map(subsection =>
                                subsection.id === editingSection.id
                                  ? editingSection
                                  : subsection
                              )
                            }
                      ));
                      setEditingSection(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Select a section to edit its content
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface LabelProps {
  children: React.ReactNode;
}

function Label({ children }: LabelProps) {
  return (
    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </span>
  );
}