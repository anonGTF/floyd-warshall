export type MenuItemArgs = {
    label: string,
    route?: string,
    icon?: string,
    selectedIcon?: string,
    subMenuItems?: Array<MenuItemArgs>
}