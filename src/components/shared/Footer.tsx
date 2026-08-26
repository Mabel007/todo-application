export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
      <p className="text-center">
        &copy; {new Date().getFullYear()} Todo App. All rights reserved.
      </p>
    </footer>
  );
}
