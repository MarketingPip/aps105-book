#include <stdio.h>
#include <stdlib.h>

typedef struct node {
    int data;
    struct node *next;
} Node;

Node *createNode(int value);
void printList(Node *head);

int main(void) {
    Node *head = NULL;

    head = createNode(1);
    head->next = createNode(2);
    head->next->next = createNode(4);

    printList(head); 
    return 0;
}

Node *createNode(int value) {
    Node *newNode = (Node *)malloc(sizeof(Node));

    if (newNode != NULL) {
        newNode->data = value;
        newNode->next = NULL;
    }

    return newNode;
}

void printList(Node *head) {
    Node *current = head;

    while (current != NULL) {
      printf("%d ->", current->data);
      current = current->next;
    }
}
