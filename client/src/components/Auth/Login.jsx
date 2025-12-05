import React, { useState, useContext } from "react";
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
  Spinner,
  Link as ChakraLink,
  // useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api";


export default function Login() {
  const navigate = useNavigate();
  // const toast = useToast();
  
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("success");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, accessToken } = await loginUser(form);
      
      console.log("Login response user:", user); 
      console.log("Access token:", accessToken); 

      login(user, accessToken);

      setModalStatus("success");
      setModalMessage("Login Successful!");
      setModalOpen(true);

      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      setModalStatus("error");
      setModalMessage(err.message || "Login failed");
      setModalOpen(true);
    }

    setLoading(false);
  };


  return (
    <Box
      minH="100vh"
      w="100vw"
      overflow="hidden"
      zIndex={20}
      bgGradient="linear(to-br, gray.900, #0f1724)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
    >
      <Box
        position="absolute"
        top="-6"
        left="-6"
        w="72"
        h="72"
        bg="purple.600"
        opacity="0.12"
        filter="blur(56px)"
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-6"
        right="-6"
        w="72"
        h="72"
        bg="blue.600"
        opacity="0.12"
        filter="blur(56px)"
        borderRadius="full"
        pointerEvents="none"
      />

      <Box position="relative" zIndex={10} w="full" maxW="md">

        <Box textAlign="center" mb={6}>
          <Heading size="lg" color="white">
            Sugooianime
          </Heading>
          <Text color="gray.300" fontSize="sm">
            Welcome back — discover your next favorite anime
          </Text>
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

              <FormControl id="email" isRequired>
                <FormLabel color="gray.300" fontSize="sm">
                  Email address
                </FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  bg="rgba(255,255,255,0.03)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel color="gray.300" fontSize="sm">
                  Password
                </FormLabel>
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
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <ViewOffIcon color="gray.200" />
                      ) : (
                        <ViewIcon color="gray.200" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <HStack w="full" justify="space-between">
                <Text mt={4} color="gray.400" fontSize="xs" textAlign="center">
                  Don't have an account?{" "}
                  <ChakraLink as={Link} to="/signup" color="purple.300" fontSize="sm">
                    Create account
                  </ChakraLink>
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
                {loading ? <Spinner size="sm" color="white" /> : "Login"}
              </Button>

            </VStack>
          </form>
        </Box>
      </Box>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(50px)" />

        <ModalContent
          bg="rgba(15,23,42,0.9)"
          border="1px solid rgba(82,125,255,0.4)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          textAlign="center"
          p={6}
        >
          <ModalHeader color="white" fontSize="xl">
            {modalStatus === "success" ? "Success" : "Error"}
          </ModalHeader>

          <ModalBody>
            <Text fontSize="md" color="gray.200">
              {modalMessage}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.400" }}
              onClick={() => setModalOpen(false)}
              w="full"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}