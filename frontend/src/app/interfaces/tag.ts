export interface Tag {
    id: string;
    name: string;
    events: EventTag[];
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
  
  export interface EventTag {
    eventId: string;
    tagId: string;
    event: Event;
    tag: Tag;
}
  