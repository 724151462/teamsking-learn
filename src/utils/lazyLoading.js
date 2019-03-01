export default (name) => () => {
    alert(123)
    import(`@/views/${name}.vue`)
}
