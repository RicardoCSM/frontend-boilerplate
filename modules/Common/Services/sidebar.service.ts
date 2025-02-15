import {
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
} from "../Interfaces/Sidebar";

const sidebarService = {
  getFlattenedItems(navItems: SidebarNav, permissions: string[]) {
    const flattenedItems: SidebarNavItem[] = [];
    const navItemsFiltered = this.getAuthorizedNavItems(navItems, permissions);

    navItemsFiltered.navIndex.forEach((item: SidebarNavItem) => {
      flattenedItems.push({
        title: item.title,
        url: item.url,
        icon: item.icon,
      });
    });

    navItemsFiltered.navMain.forEach((group: SidebarNavGroup) => {
      group.items.forEach((subItem) => {
        flattenedItems.push({
          title: `${group.title} - ${subItem.title}`,
          url: subItem.url,
          icon: group.icon,
        });
      });
    });

    return flattenedItems;
  },
  getAuthorizedNavItems(navItems: SidebarNav, permissions: string[]) {
    const filteredNav: SidebarNav = {
      navIndex: [],
      navMain: [],
    };

    navItems.navIndex.forEach((item: SidebarNavItem) => {
      if (
        permissions.some((permission) =>
          permission.includes(item.requiredPermission ?? ""),
        )
      ) {
        filteredNav.navIndex.push(item);
      }
    });

    navItems.navMain.forEach((group: SidebarNavGroup) => {
      const filteredGroup: SidebarNavGroup = {
        title: group.title,
        url: group.url,
        icon: group.icon,
        isActive: group.isActive,
        items: [],
      };

      group.items.forEach((subItem) => {
        if (
          permissions.some((permission) =>
            permission.includes(subItem.requiredPermission ?? ""),
          )
        ) {
          filteredGroup.items.push(subItem);
        }
      });

      if (filteredGroup.items.length > 0) {
        filteredNav.navMain.push(filteredGroup);
      }
    });

    return filteredNav;
  },
};

export default sidebarService;
