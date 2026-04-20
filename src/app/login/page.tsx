export default function Login() {
  return (
    <div>
      <form action="api/login" method="POST">
        <input type="text" name="email" id="" placeholder="email" />
        <input type="password" name="password" id="" placeholder="password" />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
