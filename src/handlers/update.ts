import { Update } from "@prisma/client";
import prisma from "../db";

export const getUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce<Update[]>((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.json({
    data: updates,
  });
};

export const getOneUpdate = async (req, res) => {
  const id = req.params.id;

  const update = await prisma.update.findUnique({
    where: {
      id,
    },
  });

  res.json({ data: update });
};

export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    //does not belong to user
    res.json({ message: "This product does not belong to the current user" });
  }

  const update = await prisma.update.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      product: { connect: { id: product?.id } },
    },
  });

  res.json({ data: update });
};

export const updateUpdate = async (req, res) => {
  try {
    const updatedUpdate = await prisma.update.updateMany({
      where: {
        id: req.params.id,
        product: {
          belongsToId: req.user.id,
        },
      },
      data: req.body,
    });

    if (updatedUpdate.count === 0) {
      return res.json({ message: "no match found" });
    }

    const result = await prisma.update.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.json({ data: result });
  } catch (error) {
    console.error("Error updating update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUpdate = async (req, res) => {
  try {
    const updateToDelete = await prisma.update.findFirst({
      where: {
        id: req.params.id,
        product: {
          belongsToId: req.user.id,
        },
      },
    });

    if (!updateToDelete) {
      return res.json({ message: "no match found" });
    }

    const deletedUpdate = await prisma.update.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ data: deletedUpdate });
  } catch (error) {
    console.error("Error deleting update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
