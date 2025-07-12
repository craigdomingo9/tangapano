

type Props = {
    searchParams: { [key: string]: string }
}

async function page({searchParams}: Props) {

  const params = await searchParams;
  console.log(params);

  return (
    <div>page</div>
  )
}

export default page