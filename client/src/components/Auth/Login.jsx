import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaFilm } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "All fields are required", status: "warning", duration: 2000 });
      return;
    }

    try {
      setLoading(true);
      await loginUser(form, navigate); // api helper handles navigation + storage
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast({ title: msg, status: "error", duration: 4000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box minH="100vh" zIndex={20} bgGradient="linear(to-br, gray.900, #0f1724)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box position="absolute" top="-6" left="-6" w="72" h="72" bg="purple.600" opacity="0.12" filter="blur(56px)" borderRadius="full" />
      <Box position="absolute" bottom="-6" right="-6" w="72" h="72" bg="blue.600" opacity="0.12" filter="blur(56px)" borderRadius="full" />

      <Box position="relative" zIndex={10} w="full" maxW="md">
        {/* header */}
        <Box textAlign="center" mb={6}>
          <HStack justify="center" spacing={3}>
            {/* <FaFilm size={28} color="#b794f4" /> */}
            <Heading size="lg" color="white">Sugooianime</Heading>
          </HStack>
          <Text color="gray.300" fontSize="sm">Welcome back — discover new favorite anime</Text>
        </Box>

        <Box
          bg="rgba(15, 23, 42, 0.6)"
          border="1px solid"
          borderColor="rgba(255,255,255,0.04)"
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          backdropFilter="blur(8px)"
        >
          <Heading as="h2" size="md" mb={4} color="white" textAlign="center">
            Sign in to your account
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="email">
                <FormLabel color="gray.300" fontSize="sm">Email address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  bg="rgba(255,255,255,0.03)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  required
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel color="gray.300" fontSize="sm">Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    bg="rgba(255,255,255,0.03)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    required
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={() => setShowPassword((s) => !s)} aria-label="toggle password">
                      {showPassword ? <ViewOffIcon color="gray.200" /> : <ViewIcon color="gray.200" />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <HStack w="full" justify="space-between">
                <Text mt={4} color="gray.400" fontSize="xs" textAlign="center">
                  Don't have an account?{" "}
                  <ChakraLink as={Link} to="/signup" color="purple.300" fontSize="sm">Create account</ChakraLink>
                </Text>
              </HStack>

              <Button
                type="submit"
                w="full"
                mt={2}
                bgGradient="linear(to-r, purple.500, purple.600)"
                color="white"
                _hover={{ transform: "translateY(-2px)" }}
                isDisabled={loading}
              >
                {loading ? <Spinner size="sm" color="white" /> : "Sign In"}
              </Button>
            </VStack>
          </form>
        </Box>


      </Box>
    </Box>
  );
}