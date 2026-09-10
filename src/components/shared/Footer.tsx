export default function Footer() {
  return (
    <footer
      className={"bg-card border-divider text-muted-foreground w-full border-t px-6 py-4 text-sm"}
    >
      <p className={"mx-auto max-w-4xl text-center"}>
        &copy; {new Date().getFullYear()} Todo App. All rights reserved.
      </p>
    </footer>
  );
}
