interface IRemember {
  read(key: string): string

  write(key: string, value: string): string
}
