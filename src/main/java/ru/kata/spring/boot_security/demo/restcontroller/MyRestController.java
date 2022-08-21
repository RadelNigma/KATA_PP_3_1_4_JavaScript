package ru.kata.spring.boot_security.demo.restcontroller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exeption_handing.NoSuchUserException;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class MyRestController {

    private final UserService userService;
    private final RoleService roleService;

    public MyRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/")
    public List<User> getAllUsers() {
        return userService.finedAll();
    }

    @GetMapping("/role")
    public List<Role> getAllRoles() {
        return roleService.finedAllRoles();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable long id) {
         User user = userService.findById(id);
         if (user==null){
             throw new NoSuchUserException("There is no user with ID = "
                     + id + " in Database!");
         }
        return user;
    }

    @PostMapping("/")
    public User addNewUser(@RequestBody User user){
        userService.saveUser(user);
        return user;
    }
    @PatchMapping("/")
    public User updateUser (@RequestBody User user){
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable long id) {
        User user = userService.findById(id);
        if (user==null){
            throw new NoSuchUserException("There is no user with ID = "
                    + id + " in Database!");
        }
        userService.deleteById(id);
        return "User with ID = " + id + " was deleted!";
    }

    @GetMapping("/principal")
    public User viewAdminPage(Model model, Principal principal){
        User principalUser = userService.findUserByEmail(principal.getName());
        model.addAttribute("user", principalUser);
        return principalUser;
    }
}
