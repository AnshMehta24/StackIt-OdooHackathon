import { useRef } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Input } from "@/components/ui/input";
import { useUploadFile } from "@/hooks/upload";
import { toast } from "sonner";
import { useAddQuestion } from "@/hooks/services/questions";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  tags: z
    .array(z.string())
    .min(1, "Add at least one tag")
    .max(5, "Maximum 5 tags"),
});

type FormData = z.infer<typeof formSchema>;

const AskQuestionPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      tags: [],
    },
  });

  const { watch, setValue } = form;
  const tags = watch("tags");
  const currentTagRef = useRef("");

  const uploadFileMutation = useUploadFile();
  const addQuestionMutation = useAddQuestion();

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setValue("tags", [...tags, trimmed]);
      currentTagRef.current = "";
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = async (values: FormData) => {
    const content = editorRef.current?.getContent();
    if (!content || content.trim() === "") {
      toast.error("Wait for Editor to load. Or Refresh the window.");
      return;
    }

    const c = content as string;
    const data = { ...values, content: c };
    await toast.promise(addQuestionMutation.mutateAsync(data), {
      loading: "Adding Question...",
      success: () => {
        navigate("/");
        return "Question Added successfully!";
      },
      error: (err) => {
        return err instanceof Error ? err.message : "Something went wrong";
      },
    });
    navigate("/");
  };

  const popularTags = [
    "react",
    "typescript",
    "javascript",
    "node.js",
    "next.js",
    "tailwind-css",
    "python",
    "css",
    "html",
    "git",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
            <p className="text-muted-foreground">
              Get help from the community by asking a clear, detailed question
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="grid lg:grid-cols-3 gap-8 w-full"
                >
                  <div className="lg:col-span-3 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Title</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Be specific and imagine you're asking a question
                                to another person
                              </FormLabel>
                              <FormControl>
                                <RHFTextInput
                                  placeholder="e.g. How to implement authentication in React with TypeScript?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Editor
                          onInit={(evt, editor) => {
                            editorRef.current = editor;

                            editor.on("change", () => {
                              console.log("Content changed");
                            });
                          }}
                          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                          init={{
                            height: 300,
                            plugins: "image link lists code",
                            toolbar:
                              "undo redo | formatselect | bold italic | image | code",
                            images_upload_handler: async (
                              blobInfo: {
                                blob: () => Blob;
                                filename: () => string | undefined;
                              },
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              success: (arg0: any) => void,
                              failure: (arg0: string) => void
                            ) => {
                              try {
                                const formData = new FormData();
                                formData.append(
                                  "file",
                                  blobInfo.blob(),
                                  blobInfo.filename()
                                );

                                const res =
                                  await uploadFileMutation.mutateAsync(
                                    formData
                                  );

                                const { data } = res;
                                console.log(data);
                                success(data.filePath);
                              } catch (err) {
                                console.error(err);
                                failure("Upload failed");
                              }
                            },
                          }}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Tags</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="tags"
                          render={() => (
                            <FormItem>
                              <FormLabel>
                                Add up to 5 tags to describe your question
                              </FormLabel>
                              <FormControl>
                                <div className="flex space-x-2">
                                  <Input
                                    value={currentTagRef.current}
                                    onChange={(e) =>
                                      (currentTagRef.current = e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        handleAddTag(currentTagRef.current);
                                      }
                                    }}
                                    placeholder="Type a tag and press Enter"
                                    disabled={tags.length >= 5}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleAddTag(currentTagRef.current)
                                    }
                                    disabled={
                                      !currentTagRef.current.trim() ||
                                      tags.length >= 5
                                    }
                                    size="icon"
                                    className="text-foreground"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-tag-bg text-tag-text border-tag-border px-3 py-1"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium mb-2">
                            Popular tags:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {popularTags
                              .filter((tag) => !tags.includes(tag))
                              .slice(0, 8)
                              .map((tag) => (
                                <Button
                                  key={tag}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddTag(tag)}
                                  disabled={tags.length >= 5}
                                  className="text-xs"
                                >
                                  {tag}
                                </Button>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="px-8 text-foreground"
                      >
                        {form.formState.isSubmitting
                          ? "Posting..."
                          : "Post Question"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Sidebar Tips */}
                  <div className="lg:col-span-1">
                    {/* Sidebar Cards – unchanged */}
                  </div>
                </form>
              </Form>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    How to ask a good question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">1. Write a clear title</h4>
                    <p className="text-muted-foreground">
                      Summarize your problem in a one-line title
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      2. Describe your problem
                    </h4>
                    <p className="text-muted-foreground">
                      Explain what you're trying to do and what happened instead
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">3. Show what you tried</h4>
                    <p className="text-muted-foreground">
                      Include code, error messages, and research efforts
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">4. Add relevant tags</h4>
                    <p className="text-muted-foreground">
                      Help others find your question by adding relevant tags
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Be respectful and courteous</p>
                  <p>• Search before asking</p>
                  <p>• Write in clear, grammatical language</p>
                  <p>• Include relevant code and error messages</p>
                  <p>• Accept helpful answers to close the question</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;
